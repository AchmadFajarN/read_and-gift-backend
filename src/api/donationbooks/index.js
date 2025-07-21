const DonationBooksHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'donationbooks',
  version: '1.0.0',
  register: async (server, { donationBooksService, donationstorageService, coverPathDonationsService, donationBookValidator }) => {
    const handler = new DonationBooksHandler(
      donationBooksService,
      donationstorageService,
      coverPathDonationsService,
      donationBookValidator
    );

    server.route(routes(handler));
  },
};
