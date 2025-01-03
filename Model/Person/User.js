import db from "../../Service/database.js";
import env from "dotenv";

import Book from "../Book/Book.js";
import bcrypt from "bcrypt";

env.config();


class User {
    user_id
    email
    #password
    user_name
    avatar

    async init(id) {
        const query = `
        SELECT *
        FROM users
        WHERE user_id = $1;
        `;
        try {
            const result = await db.query(query, [id]);
            if (result.rows.length > 0) {
                const userData = result.rows[0];
                this.user_id = userData.user_id;
                this.email = userData.email;
                this.user_name = userData.user_name;
                this.avatar = userData.avatar;
                this.#password = userData.password;
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            console.error('Error finding user by ID:', err);
            throw err;
        }
    }


    static async create(email, password, name) {
        const query = `
            INSERT INTO users (email, password, user_name, avatar)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, email, user_name, avatar;
        `
        const values = [email, password, name, process.env.Default_Image];
        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error('Error creating user:', err);
            throw err;
        }
    }

    async comparePassword(typeInPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(typeInPassword, this.#password, (err, valid) => {
                if (err) {
                    console.error("Error comparing passwords:", err);
                    reject(err);
                } else {
                    resolve(valid);
                }
            });
        });
    }

    static async findById(id) {
        const query = `
            SELECT user_id, email, user_name, avatar
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
            SELECT user_id, email, user_name
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

    static async updateUserInteraction(book_id, user_id, interaction_type, value) {
        const query = `
            INSERT INTO user_interactions (book_id, user_id, interaction_type, value)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        try {
            const type = ["follow", "rating" , "view"]
            if (!type.includes(interaction_type)) {
                throw new Error(`type chỉ được một trong những loại sau: ${type.join(", ")}`)
            } else if (interaction_type == "rating" && (!Number.isInteger(value) || value > 5 || value < 0)) {
                throw new Error(`Giá trị của bạn là ${value}, chỉ được là số nguyên và trong khoảng từ 0 đến 5.`);
            } else if (interaction_type == "follow") {
                const result = await User.isUserFollowBook(book_id, user_id)
                if (result) {
                    await User.deleteInteraction(result.interaction_id)
                    return {message: "người dùng đã theo dõi, nên từ bỏ theo dõi"}
                }
            }

            const result = await db.query(query, [book_id, user_id, interaction_type, value])
            return result.rows[0]
        } catch (err) {
            console.error('Error handler interaction:', err);
            throw err;
        }
    }

    static async deleteInteraction(interaction_id){
        const query = `
            DELETE
            FROM user_interactions
            WHERE interaction_id = $1
        `
        try {
            const result = await db.query(query, [interaction_id])
        } catch (err) {
            console.error('Error handler delete an interaction:', err);
            throw err;
        }
    }

    static async isUserFollowBook(book_id, user_id){
        const query = `
            SELECT *
            FROM user_interactions
            WHERE book_id = $1
            AND user_id = $2
            AND interaction_type = 'follow'
        `
        try {
            const result = await db.query(query, [book_id, user_id])

            if (result.rows[0]) {
                return result.rows[0]
            } else {
                return false
            }
        } catch (err) {
            console.error(`Error handler finding is the user ${user_id} follow this book ${book_id}: `, err);
            throw err;
        }
    }

    static async isUserRatedBook(book_id, user_id){
        const query = `
            SELECT *
            FROM user_interactions
            WHERE book_id = $1
            AND user_id = $2
            AND interaction_type = 'rating'
        `
        try {
            const result = await db.query(query, [book_id, user_id])
            if (result.rows[0]) {
                return result.rows[0]
            } else {
                return false
            }
        } catch (err) {
            console.error(`Error handler finding is the user ${user_id} rating this book ${book_id}: `, err);
            throw err;
        }
    }

    static async checkFollowedBooks(id, page) {
        const query = `
            SELECT book_id
            From user_interactions
            WHERE user_id = $1
            AND interaction_type = 'follow'
            LIMIT 10 OFFSET $2;
        `
        try {
            const books = await db.query(query, [id, (page * 10) - 10])
            if (!books.rows) {
                throw new Error("Người dùng đang không follow truyện nào")
            }

            const result = []
            for (let i = 0; i < books.rows.length; i++) {
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