import db from "../../Service/database.js";

class Artist {
    static async create(name) {
        const query = `
            INSERT INTO artists (artist_name)
            VALUES ($1)
            RETURNING *            
        `
        try {
            const result = await db.query(query, [name])
            return result.rows[0]
        } catch (err) {
            console.error('Error create artist:', err);
            throw err;
        }
    }

    static async findById(id) {
        const query = `
            SELECT *
            FROM artists
            WHERE artist_id = $1
        `
        try {
            const result = await db.query(query, [id])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding artist by id:', err);
            throw err;
        }
    }

    static async findByName(name) {
        const query = `
        SELECT *
        FROM artists
        WHERE artist_name = $1
    `
        try {
            const result = await db.query(query, [name])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding artist by name:', err);
            throw err;
        }
    }

    static async checkExist(name) {
        const check = await Artist.findByName(name)
        if (check) {
            return check
        } else {
            const createArtist = await Artist.create(name)
            return createArtist
        }
    }
}

export default Artist