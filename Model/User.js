import db from "../API_Router/database.js";

class User {
  static async create(email, password, displayname, picture) {
    const query = `
      INSERT INTO users (email, password, displayname, picture)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email;
    `;
    const values = [email, password, displayname, picture];
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }

  static async findById(id) {
    const query = `
      SELECT id, email, password, displayname, picture
      FROM users
      WHERE id = $1;
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      console.error('Error finding user by ID:', err);
      throw err;
    }
  }

  static async findByEmail(email) {
    const query = `
      SELECT id, email, password, displayname, picture
      FROM users
      WHERE email = $1;
    `;
    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (err) {
      console.error('Error finding user by email:', err);
      throw err;
    }
  }
}

export default User;