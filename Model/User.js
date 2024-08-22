import db from "../API_Router/database.js";
import env from "dotenv";

env.config();


class User {
  static async create(email, password) {
    const query = `
      INSERT INTO users (email, password, displayname, picture)
      VALUES ($1, $2, $3, $4)
      RETURNING userid, email, displayname, picture;
    `;
    const values = [email, password, "user", process.env.Default_Image];
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
      SELECT userid, email, password, displayname, picture
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
      SELECT userid, email
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