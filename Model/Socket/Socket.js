import db from '../../Service/database.js'

class Socket {
    static async addNewChat(room_id, user_id, content) {
        const query = `
            INSERT INTO socket (room_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `
        try {
            const result = await db.query(query, [room_id, user_id, content])
            return result.rows[0]
        } catch (err) {
            console.error('Error adding new chat in to database:', err);
            throw err;
        }
    }

    static async addNewReply(socket_id, user_id, content) {
        const query = `
            INSERT INTO socket_replies (socket_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `
        try {
            const result = await db.query(query, [socket_id, user_id, content])
            return result.rows[0]
        } catch (err) {
            console.error('Error adding new reply in to database:', err);
            throw err;
        }
    }

    static async addLike(socket_id, replies_id, user_id) {
        const query = `
            INSERT INTO socket_likes (socket_id, replies_id, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `
        try {
            const result = await db.query(query, [socket_id, replies_id, user_id])
            return result.rows[0]
        } catch (err) {
            console.error('Error adding new like to a commment:', err);
            throw err;
        }
    }

    static async getChatInRoom(room_id, page){
        const query = `
            SELECT socket_id, room_id, socket.user_id, user_name, avatar, content, timestamp
            FROM socket
                INNER JOIN users ON socket.user_id = users.user_id
            WHERE room_id = $1
            ORDER BY timestamp DESC
            LIMIT 10 OFFSET $2
        `
        try {
            const result = await db.query(query, [room_id, (page * 10) - 10])
            return result.rows
        } catch (err) {
            console.error('Error adding new like to a socket:', err);
            throw err;
        }
    }
}

export default Socket