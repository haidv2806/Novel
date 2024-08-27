import db from "../../API_Router/database";
import Chapter from "./Chapter";

class Volume extends Chapter {
    constructor (bookID) {
        if (bookID === undefined) {
            throw new Error("volume đang yêu cầu id của sách.");
          }
          this.bookID = bookID;
    }

    static async create(name) {
        const query = `
            INSERT INTO volumes (volume_name, book_id)
            VALUES $1, $2
            RETURNING *
        `
        try {
            const result = await db.query(query, [name, this.bookID])
            return result.rows[0]
        } catch (err) {
            console.error('Error creating volume:', err);
            throw err;
        }
    }

    static async createChapter(volumeName, ChapterName, content) {
        const query = `
            SELECT volume_id
            FROM volumes
            WHERE volume_name = $1
            AND book_id = $2
        `
        try {
            const result = await db.query(query, [volumeName, this.bookID])
            const volume_id = result.rows[0]
            super(volume_id)
            super.create(ChapterName, content)
        } catch (err) {
            console.error('Error creating chapter:', err);
            throw err;
        }
    }
}

export default Volume