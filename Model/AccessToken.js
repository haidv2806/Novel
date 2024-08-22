import db from '../API_Router/database.js';

class AccessToken {
  static async create(token, userId) {
    const query = `
      INSERT INTO access_tokens (token, user_id, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, token, user_id;
    `;
    const values = [token, userId];
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating access token:', err);
      throw err;
    }
  }

  static async findOne(token) {
    const query = `
      SELECT id, token, user_id
      FROM access_tokens
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

  static isValid(accessToken) {
    // Example validation logic: Check if the token is not expired
    const query = `
      SELECT id
      FROM access_tokens
      WHERE id = $1 AND created_at > NOW() - INTERVAL '1 hour';
    `;
    try {
      const result = db.query(query, [accessToken.id]);
      return result.rowCount > 0;
    } catch (err) {
      console.error('Error validating access token:', err);
      return false;
    }
  }
}

export default AccessToken;