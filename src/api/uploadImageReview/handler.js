class uploadImageReviewHandler {
    constructor(storageService, validator, imageReviewService) {
        this._storageService = storageService;
        this._validator = validator;
        this._imageReviewService = imageReviewService

        this.postImageHandler = this.postImageHandler.bind(this);
    }

    async postImageHandler(req, h) {
        const { image } = req.payload;
        const { id } = req.params;

        this._validator.validateImageHeader(image.hapi.headers);
        const { filename: meta } = image.hapi;
        const fileName = `${+new Date()}-${meta}`;
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const pathUrl = `${baseUrl}/review/img/${fileName}`;

        await this._imageReviewService.uploadImageReview(id, pathUrl);
        await this._storageService.writeFile(image, fileName);

        const response = h.response({
            status: 'success',
            message: 'image berhasil ditambahkan',
            data: {
                url: pathUrl
            }
        });

        response.code(201);
        return response;

    }
}

module.exports = uploadImageReviewHandler