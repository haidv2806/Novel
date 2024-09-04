import db from "../../API_Router/database.js";
import Chapter from "./Chapter.js";

class Volume{

    static async create(name, bookID) {
        const query = `
            INSERT INTO volumes (volume_name, book_id)
            VALUES ($1, $2)
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

    // static async createChapter(volumeName, ChapterName, content) {
    //     try {
    //         const volume = await Volume.findByName(volumeName)
    //         const volume_id = volume.volume_id
    //         const chapter = await Chapter.create(ChapterName, content, volume_id)
    //         return chapter
    //     } catch (err) {
    //         console.error('Error creating chapter:', err);
    //         throw err;
    //     }
    // }
}

export default Volume