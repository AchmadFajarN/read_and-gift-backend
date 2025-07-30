const mapDBToModel = ({
  id,
  title,
  author,
  publisher,
  publish_year,
  synopsis,
  genre,
  book_condition,
  donation_image_path,
  owner
}) => ({
  id,
  title,
  author,
  publisher,
  publishYear: String(publish_year),
  synopsis,
  genre,
  bookCondition: book_condition,
  donationCoverPath: donation_image_path,
  owner,
});


module.exports = mapDBToModel;
