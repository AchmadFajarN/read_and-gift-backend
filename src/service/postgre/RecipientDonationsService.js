const { Pool } = require('pg');
const InvariantError = require('../../exeption/InvariantError');
const NotFoundError = require('../../exeption/NotFoundError');
const { nanoid } = require('nanoid');

class RecipientDonations {
  constructor() {
    this._pool = new Pool();
  }

  async addRecipientDonations({ donationBookId, recipientId }) {
    const id = `recipient_donation-${nanoid(16)}`;
    const createdAt = new Date().toISOString();


    // cari donatur (owner buku)
    const resultUserId = await this._pool.query({
      text: `SELECT owner FROM donation_books WHERE id = $1`,
      values: [donationBookId],
    });

    if (!resultUserId.rows.length) {
      throw new NotFoundError('Buku donasi tidak ditemukan');
    }

    const userId = resultUserId.rows[0].owner;

    // insert permintaan
    const result = await this._pool.query({
      text: `
        INSERT INTO recipient_donations (id, id_donation, user_id, recipient_id, created_at) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, donation_status
      `,
      values: [id, donationBookId, userId, recipientId, createdAt],
    });

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan permintaan donasi');
    }

    return {
      id: result.rows[0].id,
      donationStatus: result.rows[0].donation_status,
    };
  }

  async updateDonationStatus({ recipientDonationId, status, userId }) {
    const result = await this._pool.query({
      text: `
        UPDATE recipient_donations 
        SET donation_status = $1 
        WHERE id = $2 AND user_id = $3
        RETURNING recipient_id, 
          (SELECT no_contact FROM users WHERE id = $3) AS no_contact
      `,
      values: [status, recipientDonationId, userId],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Data tidak ditemukan atau Anda tidak berhak.');
    }

    if (status === 'approved') {
  await this._pool.query({
    text: `UPDATE donation_books SET is_available = false WHERE id = (
             SELECT id_donation FROM recipient_donations WHERE id = $1
           )`,
    values: [recipientDonationId],
  });
}

    return {
      recipientId: result.rows[0].recipient_id,
      noContact: result.rows[0].no_contact,
    };
  }

async getRecipientDonations({ userId, status }) {
  const query = {
    text: `
      SELECT 
        rd.id,
        rd.id_donation AS "donationBookId",
        rd.recipient_id AS "recipientId",
        ru.username AS "recipientUsername",  -- username dari recipient
        rd.user_id AS "donorId",
        rd.donation_status AS "donationStatus"
      FROM recipient_donations rd
      JOIN users ru ON ru.id = rd.recipient_id
      WHERE (rd.user_id = $1 OR rd.recipient_id = $1)
      ${status ? 'AND rd.donation_status = $2' : ''}
      ORDER BY rd.created_at DESC
    `,
    values: status ? [userId, status] : [userId],
  };

  const result = await this._pool.query(query);

  return result.rows;
}



}

module.exports = RecipientDonations;
