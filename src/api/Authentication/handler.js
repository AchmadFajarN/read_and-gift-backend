const InvariantError = require('../../exeption/InvariantError');

class AuthenticationsHandler {
    constructor(authenticationService, userService, tokenManager, validator) {
        this._authenticationService = authenticationService;
        this._tokenManager = tokenManager;
        this._validator = validator
        this._userService = userService;

        this.postAuthLogin = this.postAuthLogin.bind(this);
        this.putAuthLogin = this.putAuthLogin.bind(this);
        this.deleteAuthLogin = this.deleteAuthLogin.bind(this);
    };

    async postAuthLogin (req, h) {
        this._validator.validatePostAuthenticationPayload(req.payload);

        const { email, password } = req.payload;
        const { id, role } = await this._userService.verifyUserCredentials(email, password);
        console.log(id, role)

        const accessToken = this._tokenManager.generateAccessToken({ id, role });
        const refreshToken = this._tokenManager.generateRefreshToken({ id, role });

        await this._authenticationService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: "Login Berhasil",
            data: {
                userId: id,
                accessToken,
            }
        }).state('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'Lax',
            ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        response.code(201);
        return response;
    }

    async putAuthLogin(req, h) {
        const { refreshToken } = req.state;
        if (!refreshToken) {
            throw new InvariantError('Refresh token tidak ditemukan');
        }

        await this._authenticationService.verifyRefreshToken(refreshToken);
        const { id, role } = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({ id, role });
        return {
            status: 'success',
            message: 'Access token berhasil diperbarui',
            data: {
                accessToken
            }
        }
    }

    async deleteAuthLogin(req, h) {
        const { refreshToken } = req.state;
        if (!refreshToken) {
            throw new InvariantError('Refresh token tidak ditemukan');
        }
        await this._authenticationService.verifyRefreshToken(refreshToken);
        await this._authenticationService.deleteRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Logout berhasil'
        });
        response.unstate('refreshToken');

        return response;
    }
}

module.exports = AuthenticationsHandler;