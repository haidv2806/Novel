import db from "../../API_Router/database.js";

class Chapter {
    constructor (volumeID){
        if (volumeID === undefined) {
            throw new Error("chapter đang yêu cầu id của volume.");
          }
          this.volumeID = volumeID;
    }

    static async create(name, content){
        const query = `
            INSERT INTO chapters (chapter_name, content, volume_id)
            VALUES $1, $2, $3
            RETURNING chapter_id, chapter_name, volume_id, created_at
        `
        try {
            const result = await db.query(query, [name, content, this.volumeID])
            return result.rows[0]
        } catch (err) {
            console.error('Error creating chapter:', err);
            throw err;
        }
    }
}

export default Chapter