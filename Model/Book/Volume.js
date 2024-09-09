import db from "../../API_Router/database.js";

class Volume{

    static async create(name, bookID) {
        const query = `
            INSERT INTO volumes (volume_name, book_id, volume_number)
            SELECT
                $1,
                $2,
                COALESCE(MAX(volume_number), 0) + 1
            FROM
                volumes
            WHERE
                book_id = $2
            RETURNING *
        `
        try {
            if (!name || !bookID) {
                throw new Error('Invalid input: name and bookID are required');
            }

            const result = await db.query(query, [name, bookID])
            return result.rows[0]
        } catch (err) {
            // Xử lý lỗi khi volume_name đã tồn tại
            if (err.code === '23505') { // PostgreSQL unique violation error code
                throw new Error('Volume name already exists for this book');
            }

            console.error('Error creating volume:', err);
            throw err;
        }
    }

    static async findByName(name, bookID) {
        const query = `
            SELECT *
            FROM volumes
            WHERE volume_name = $1
            AND book_id = $2
        `
        try {
            const result = await db.query(query, [name, bookID])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding volume:', err);
            throw err;
        }       
    }
}

export default Volume