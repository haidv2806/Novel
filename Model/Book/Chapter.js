import db from "../../API_Router/database.js";

class Chapter {
    static async create(name, content, volumeID){
        const query = `
            INSERT INTO chapters (chapter_name, content, volume_id)
            VALUES ($1, $2, $3)
            RETURNING chapter_id, chapter_name, volume_id, created_at
        `
        try {
            const result = await db.query(query, [name, content, volumeID])
            return result.rows[0]
        } catch (err) {
            if (err.code === '23505') { // PostgreSQL unique violation error code
                throw new Error('Chapter name already exists for this Volume');
            }
            console.error('Error creating chapter:', err);
            throw err;
        }
    }
}

export default Chapter