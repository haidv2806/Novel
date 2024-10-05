import db from '../Service/database.js';

class RefreshToken {
  static async create(token, userId) {
    const query = `
      INSERT INTO refresh_tokens (token, user_id, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, token, user_id;
    `;
    const values = [token, userId];
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating refesh token:', err);
      throw err;
    }
  }

  static async findOne(token) {
    const query = `
      SELECT id, token, user_id
      FROM refresh_tokens
      WHERE token = $1;
    `;
    try {
      const result = await db.query(query, [token]);
      return result.rows[0];
    } catch (err) {
      console.error('Error finding access token:', err);
      throw err;
    }
  }

  static isValid(refeshToken) {
    // Example validation logic: Check if the token is not expired
    const query = `
      SELECT id
      FROM refresh_tokens
      WHERE id = $1 AND created_at > NOW() - INTERVAL '1 hour';
    `;
    try {
      const result = db.query(query, [refeshToken.id]);
      return result.rowCount > 0;
    } catch (err) {
      console.error('Error validating refesh token:', err);
      return false;
    }
  }
}

export default RefreshToken;