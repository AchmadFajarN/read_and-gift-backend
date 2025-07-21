Required
--
- postgreSQL (Versi terbaru disarankan)
- nodeJs (Versi terbaru disarankan)

## Pendahuluan
- Buat file bernama `.env` jika tidak ada. 
- Isi file tersebut menggunakan format
```bash
#Server Configuration
HOST=
PORT=

# Postgre Config
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=

# Authentication config
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
ACCESS_TOKEN_AGE=

# node-pg-migrate url
DATABASE_URL==

```
## Authentication Config
- Isi setiap variable untuk 'Authentication config' kecuali `ACCESS_TOKEN_AGE` menggunakan module javascript `crypto` di REPL, contoh:
```js
require('crypto').randomBytes(64).toString('hex');
```
- Isi `ACCESS_TOKEN_AGE` dengan waktu token akan aktif misal `3600` artinya token akan aktif selama 1 jam.
```
ACCESS_TOKEN_AGE=3600
```

## Migration
- isi variable `DATABASE_URL` di file `.env` dengan format:
```bash
DATABASE_URL=postgresql://<pg-user>:<pg-password>@<-pg-host>:<pg-port>/<pg-database>
```
contoh:
```bash
DATABASE_URL=postgresql://developer:secret@localhost:5432/readAndGift
```

- Jalankan printah 
```bash
npm run migrate up
```

## Jalankan Aplikasi (Development)
- Isi variable `PORT` dan `HOST` di `.env`
```bash
HOST=localhost
PORT=5000
```

- Jalankan perintah
```bash
npm run start:dev
```

Documentation API
==
User Register
--
### Method: `POST` 
### Endpoint: /users/register
Body request required . <br>
- Mode: raw (JSON)
- Validator:
```bash
username: string
fullname: string
password: string
email: string
address: string
no_contact: number
sosmed_url: array[string]
```
Contoh body request: 
```bash
{
    "username": "budi",
    "fullname": "Ahmad Budi",
    "password": "secret",
    "email": "budi@mail.com",
    "address": "cianjur",
    "no_contact": "087712333212",
    "sosmed_url": ["http://linkedin/budi", "http://instagram/budi"]
}
```
### Response
- Status code `201 Ok`
- body response: 
```bash
{
    status: 'sucess',
    message: 'Akun berhasil terdaftar',
    data: {
        userId: 'users-ajsdnj1123'
    }
}
```

Image Profile Register
--
### 1. Method: `POST`
### Endpoint: /users/{id}/profileImge

Body request required
- Mode: multipart/form-data (image)
- Key: image
- validator: Hanya menerima format yang diperuntukan image

### Response
- status code: 201
- response body:
```bash
{
    status: 'success',
    message: 'Foto profile berhasil diunggah',
    data: {
        url: http://localhost:4000/profile/121212-userphoto
    }
}
```


User Service
--
### 1. Get User By Id
### Method: `GET`,
### Endpoint: '/user/{id}'
- User Id as params required
- Bearer Token As Authorization is Required

### Response
- Status Code(200)
- Reponse body:
```bash
{
    status: 'success',
    data: {
        username: 'budi',
        fullname: 'ahmad budi',
        image_profile_url: 'http://localhost:5000/profile/11221-userphoto' 
    }
}
```
<br>

### 2. Edit User By Id
### Method: `PUT`
### Endpoint: '/user/{id}'
- User id as param required
- Bearer Token As Authorization is Required
- Hanya pemilik akun yang bisa mengubah user

body request required
- validator:
```bash
{
    username: string,
    fullname: string,
    address: string,
    sosmed_url: array[string]
}
```
contoh:
```json
{
    "username": "John",
    "fullname": "John Doe",
    "address": "Tasik Malaya",
    "sosmed_url": ["http://linkedin/john", "https://instagram/john]
}
```
### response
- status code(200)
- response body: 
```bash
{
    status: 'success',
    message: 'akun berhasil diupdate'
}
```

### 3. Delete User By Id
### Method: `DELETE`
### Endpoint: '/user/{id}'
- User id as param required
- Bearer Token As Authorization is Required
- Hanya pemilik akun yang bisa menghapus user

### response
- status code(200)
- response body:
```json
{
    "status": "success",
    "message": "akun berhasil dihapus"
}
```

Authentication
--
### 1. Login
- Method: `POST`
- Endpoint: `/auth/login`
- Body request (raw JSON):
```json
{
  "email": "user@mail.com",
  "password": "yourpassword"
}
```
- Response:
```json
{
  "status": "success",
  "message": "Login Berhasil",
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>"
  }
}
```

### 2. Refresh Token
- Method: `PUT`
- Endpoint: `/auth/login`
- Body request:
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```
- Response:
```json
{
  "status": "success",
  "message": "Access token berhasil diperbarui",
  "data": {
    "accessToken": "<jwt-access-token>"
  }
}
```

### 3. Logout
- Method: `DELETE`
- Endpoint: `/auth/login`
- Body request:
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```
- Response:
```json
{
  "status": "success",
  "message": "refresh token berhasil dihapus"
}
```

Upload Image Profile
--
### 1. Get Foto Profil
- Method: `GET`
- Endpoint: `/profile/{params*}`
- Response:  
  - Mengembalikan file gambar sesuai path.

Review Buku
--
### 1. Tambah Review
- Method: `POST`
- Endpoint: `/review`
- Authorization: Bearer Token Required
- Body request:
```json
{
  "title": "Buku A",
  "author": "Penulis A",
  "publisher": "Penerbit A",
  "publish_year": 2024,
  "synopsis": "Sinopsis buku",
  "genre": ["Fiksi", "Drama"],
  "rating": 5,
  "description": "Ulasan lengkap tentang buku ini."
}
```
- Response:
```json
{
  "status": "success",
  "message": "review berhasil ditambahkan",
  "data": {
    "reviewId": "review-xxxx"
  }
}
```

### 2. Get Semua Review (Pagination & Search)
- **Method:** `GET`
- **Endpoint:** `/review`
- **Query Parameter:**
  - `page` (opsional, default: 1) — nomor halaman yang ingin diambil
  - `limit` (opsional, default: 9) — jumlah review per halaman
  - `title` (opsional) — pencarian judul buku (partial & case-insensitive)

#### Contoh Request:
```
GET /review?page=2&limit=9&title=Harry
```

#### Contoh Response:
```json
{
  "status": "success",
  "message": "Review Berhasil didapatkan",
  "data": {
    "result": [
      {
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "publisher": "Bloomsbury",
        "publish_year": 1997,
        "synopsis": "Petualangan Harry Potter...",
        "genre": ["Fantasi"],
        "url": "http://localhost:5000/review/img/harry.jpg"
      }
      // ...maksimal 9 review per halaman, hasil bisa difilter berdasarkan judul
    ]
  }
}
```

#### Penjelasan:
- Gunakan query parameter `page` untuk memilih halaman, dan `limit` untuk menentukan jumlah review per halaman.
- Gunakan query parameter `title` untuk mencari review berdasarkan judul buku (bisa sebagian kata).
- Jika tidak menyertakan parameter, maka default adalah halaman pertama dengan 9 review.

### 3. Get Review By Id
- Method: `GET`
- Endpoint: `/review/{id}`
- Response:
```json
{
  "status": "success",
  "message": "Review berhasil didapatkan",
  "data": {
    "review": {
      "id": "review-xxxx",
      "title": "...",
      "author": "...",
      "publisher": "...",
      "publish_year": 2024,
      "synopsis": "...",
      "genre": ["Fiksi"],
      "cover_url": "...",
      "likes": 10,
      "comments": [ ... ]
    }
  }
}
```

### 4. Get Review By User
- Method: `GET`
- Endpoint: `/review/user/{userId}`
- Response:  
  - Sama seperti get semua review, tapi hanya milik user tertentu (Tanpa pagination).


### 5. Edit Review
- Method: `PUT`
- Endpoint: `/review/{id}`
- Authorization: Bearer Token Required
- Body request:  
  - Sama seperti tambah review.
- Response:
```json
{
  "status": "success",
  "message": "review sukses diedit"
}
```

### 6. Delete Review
- Method: `DELETE`
- Endpoint: `/review/{id}`
- Authorization: Bearer Token Required
- Response:
```json
{
  "status": "success",
  "message": "review berhasil dihapus"
}
```

Upload Image Review
--
### 1. Upload Cover Review
- Method: `POST`
- Endpoint: `/review/{id}/img`
- Body request (multipart/form-data):
  - Key: `image` (file)
- Response:
```json
{
  "status": "success",
  "message": "image berhasil ditambahkan",
  "data": {
    "url": "http://localhost:5000/review/img/123456-cover.jpg"
  }
}
```

### 2. Get Cover Review
- Method: `GET`
- Endpoint: `/review/img/{params*}`
- Response:  
  - Mengembalikan file gambar sesuai path.

Like Review
--
### 1. Like Review
- Method: `POST`
- Endpoint: `/like/{reviewId}`
- Authorization: Bearer Token Required
- Response:
```json
{
  "status": "success",
  "message": "like berhasil ditambahkan"
}
```

### 2. Get Likes
- Method: `GET`
- Endpoint: `/like/{reviewId}`
- Authorization: Bearer Token Required
- Response:
```json
{
  "status": "success",
  "data": {
    "likes": [
      { "user_id": "users-xxxx" }
    ]
  }
}
```

### 3. Unlike Review
- Method: `DELETE`
- Endpoint: `/like/{reviewId}`
- Authorization: Bearer Token Required
- Response:
```json
{
  "status": "success",
  "message": "like berhasil dihapus"
}
```

Comment Review
--
### 1. Tambah Komentar
- Method: `POST`
- Endpoint: `/comment/{reviewId}`
- Authorization: Bearer Token Required
- Body request:
```json
{
  "comment": "Komentar anda"
}
```
- Response:
```json
{
  "status": "success",
  "message": "komen berhasil ditambahkan"
}
```

### 2. Get Komentar
- Method: `GET`
- Endpoint: `/comment/{reviewId}`
- Authorization: Bearer Token Required
- Response:
```json
{
  "status": "success",
  "data": {
    "comments": [
      {
        "comment": "Komentar anda",
        "username": "user"
      }
    ]
  }
}
```

### 3. Edit Komentar
- Method: `PUT`
- Endpoint: `/comment/{reviewId}`
- Authorization: Bearer Token Required
- Body request:
```json
{
  "comment": "Komentar baru"
}
```
- Response:
```json
{
  "status": "success",
  "message": "Komentar berhasil di update"
}
```

### 4. Delete Komentar
- Method: `DELETE`
- Endpoint: `/comment/{reviewId}`
- Authorization: Bearer Token Required
- Response:
```json
{
  "status": "success",
  "message": "komentar berhasil dihapus"
}
```



# DONATIONS API
## postDonationBookHandler
__Method__
- Request Http: POST
- Endpoint: /donations
- Content-type: multipart/form-data
- Authentication: Required
- Request Body
- payload:
```json
{
  "title": "string",
  "author": "string",
  "publisher": "string",
  "publishYear": "integer",
  "synopsis": "string",
  "genre": "string",
  "bookCondition": "baru || bekas",
  "cover": "file"
}
```

__Response Body__
Response:
```json
{
  "status": "success",
  "message": "Buku donasi berhasil ditambahkan",
  "data": {
    "bookId": "string"
  }
}
```

## getDonationBooksHandler

__Method__
- Request Http: GET
- Endpoint: /donations
- Authentication: Not Required
- Query Parameters:
```
page: integer (default: 1)
limit: integer (default: 9)
```

__Response Body__
- Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "...": "..."
    }
  ]
}
```
## getDonationBookByIdHandler
__Method__
- Request Http: GET
- Endpoint: /donations/{id}
- Authentication: Not Required

__Response Body__
Response:
```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "string",
      "title": "string",
      "author": "string",
      "...": "..."
    }
  }
}
```

## putDonationBookByIdHandler
__Method__
- Request Http: PUT
- Endpoint: /donations/{id}
- Content-type: multipart/form-data
- Authentication: Required

__Request Body__
payload:
```json
{
  "title": "string",
  "author": "string",
  "publisher": "string",
  "publishYear": "string",
  "synopsis": "string",
  "genre": "string",
  "bookCondition": "string",
  "cover": "file (optional)"
}
```

__Response Body__
- Response:
```json
{
  "status": "success",
  "message": "Buku berhasil diperbarui"
}
```

## deleteDonationBookByIdHandler
__Method__
- Request Http: DELETE
- Endpoint: /donations/{id}
- Authentication: Required

__Response Body__
Response:
```json
{
  "status": "success",
  "message": "Buku donasi berhasil dihapus"
}
```

# RECIPIENT DONATIONS API

## postRecipientDonationHandler
__Method__
- Request Http: POST
- Endpoint: /recipient-donations/{donationBookId}/request
- Authentication: Required

__Response Body__
Response:
```json
{
  "status": "success",
  "data": {
    "donationStatus": "string",
    "id": "string"
  }
}
```

## updateDonationStatusHandler
__Method__
- Request Http: PATCH
- Endpoint: /recipient-donations/{recipientDonationId}/status
- Authentication: Required

__Request Body__
- payload:
```json
{
  "status": "approve || rejected"
}
```

__Response Body__

- Response:
```json
{
  "status": "success",
  "message": "Status berhasil diperbarui"
}
```

## getRecipientDonationsHandler
__Method__
- Request Http: GET
- Endpoint: /recipient-donations
- Authentication: Required

__Query Parameters__
- status (optional): string
- Filter berdasarkan status donasi (pending, approved, rejected)

__Response Body__
- Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "recipient_donation-abc123",
      "donationBookId": "donation_book-xyz456",
      "recipientId": "user-789",
      "donorId": "user-123",
      "donationStatus": "pending"
    }
  ]
}
```