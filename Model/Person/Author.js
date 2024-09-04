import db from "../../API_Router/database.js";

class Author {
    static async create(name) {
        const query = `
            INSERT INTO authors (author_name)
            VALUES ($1)
            RETURNING *            
        `
        try {
            const result = await db.query(query, [name])
            return result.rows[0]
        } catch (err) {
            console.error('Error create author:', err);
            throw err;
        }
    }

    static async findById(id) {
        const query = `
            SELECT *
            FROM authors
            WHERE author_id = $1
        `
        try {
            const result = await db.query(query, [id])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding author by id:', err);
            throw err;
        }
    }

    static async findByName(name) {
        const query = `
        SELECT *
        FROM authors
        WHERE author_name = $1
    `
        try {
            const result = await db.query(query, [name])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding author by name:', err);
            throw err;
        }
    }

    static async checkExist(name) {
        const check = await Author.findByName(name)
        if (check) {
            return check
        } else {
            const createAuthor = await Author.create(name)
            return createAuthor
        }
    }
}

export default Author