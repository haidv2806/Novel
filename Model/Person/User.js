import db from "../../API_Router/database.js";
import env from "dotenv";
import Book from "../Book/Book.js";

env.config();


class User {
    static async create(email, password) {
        const query = `
            INSERT INTO users (email, password, user_name, avatar)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, email, user_name, avatar;
        `
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
            SELECT user_id, email, password, user_name, avatar
            FROM users
            WHERE user_id = $1;
        `
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
            SELECT user_id, email, password
            FROM users
            WHERE email = $1;
        `
        try {
            const result = await db.query(query, [email]);
            return result.rows[0];
        } catch (err) {
            console.error('Error finding user by email:', err);
            throw err;
        }
    }

    static async updateNewAvatar(id, avatar) {
        const query = `
                UPDATE users
                SET avatar = $2
                WHERE user_id = $1
                RETURNING user_id, email, avatar
        `
        try {
            const result = await db.query(query, [id, avatar]);
            return result.rows[0];
        } catch (err) {
            console.error('Error update avatar:', err);
            throw err;
        }
    }

    static async updateNewName(id, name) {
        const query = `
            UPDATE users
            SET user_name = $2
            WHERE user_id = $1
            RETURNING user_id, email, user_name
        `
        try {
            const result = await db.query(query, [id, name]);
            return result.rows[0];
        } catch (err) {
            console.error('Error update Name:', err);
            throw err;
        }
    }

    static async updateUserInteraction(book_id, user_id, interaction_type, value){
        const query = `
            INSERT INTO user_interactions (book_id, user_id, interaction_type, value)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        try {
            const type = ["like", "bookMark", "rating"]
            if (!type.includes(interaction_type)) {
                throw new Error(`type chỉ được một trong những loại sau: ${type.join(", ")}`)
            }else if (interaction_type == "rating" & value > 5){
                throw new Error (`value của bạn là ${value}, và lớn hơn 5`)
            }

            const result = await db.query(query, [book_id, user_id, interaction_type, value])
            return result.rows[0]
        } catch (err) {
            console.error('Error handler interaction:', err);
            throw err;
        }
    }

    static async checkBookMark(id, page){
        const query = `
            SELECT book_id
            From user_interactions
            WHERE user_id = $1
            AND interaction_type = 'bookMark'
            LIMIT 10 OFFSET $2;
        `
        try {
            const books = await db.query(query, [id, (page * 10) - 10])
            if(!books.rows){
                throw new Error("Người dùng đang không để bookMark nào")
            }

            const result = []
            for(let i = 0; i < books.rows.length; i++){
                const book = await Book.findById(books.rows[i].book_id)
                result.push(book)
            }

            return result
        } catch (err) {
            console.error('Không tìm thấy những quốn sách mà user đã đánh dấu', err);
            throw err;
        }
    }
}

export default User;