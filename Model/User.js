import db from "../API_Router/database.js";
import env from "dotenv";

env.config();


class User {
    static async create(email, password) {
        const query = `
      INSERT INTO users (email, password, displayname, avatar)
      VALUES ($1, $2, $3, $4)
      RETURNING userid, email, displayname, avatar;
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
      SELECT userid, email, password, displayname, avatar
      FROM users
      WHERE userid = $1;
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
      SELECT userid, email, password
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

    static async updateNewAvatar(userid, avatar) {
        const query = `
    UPDATE users
    SET avatar = $2
    WHERE userid = $1
    RETURNING userid, email, avatar
    `;
        try {
            const result = await db.query(query, [userid, avatar]);
            return result.rows[0];
        } catch (err) {
            console.error('Error update avatar:', err);
            throw err;
        }
    }
}

export default User;