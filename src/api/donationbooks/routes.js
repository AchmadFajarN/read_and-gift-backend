const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/donations',
    handler: handler.postDonationBookHandler,
    options: {
      auth: 'read_and_gift_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        parse: true,
        maxBytes: 512 * 1024, //TODO: Limitnya berapa?
      },
    },
  },
  {
    method: 'GET',
    path: '/donation/cover/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'donationbookimage/donationCovers'),
      }
    }
  },
  {
    method: 'GET',
    path: '/donations',
    handler: handler.getDonationBooksHandler,
  },
  {
    method: 'GET',
    path: '/donations/{id}',
    handler: handler.getDonationBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/donations/{id}',
    handler: handler.putDonationBookByIdHandler,
    options: {
      auth: 'read_and_gift_jwt',
            payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        parse: true,
        maxBytes: 512 * 1024, //TODO: Limitnya berapa?
      },
    },
  },
  {
    method: 'DELETE',
    path: '/donations/{id}',
    handler: handler.deleteDonationBookByIdHandler,
    options: {
      auth: 'read_and_gift_jwt',
    },
  },
];

module.exports = routes;
