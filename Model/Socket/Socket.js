import db from '../../Service/database.js'

class Socket {
    MainChat
    Reply

    constructor() {
        this.Reply = []
    }

    // lấy dữ liệu cho 1 group chat của reply
    async init(socket_id) {
        const mainChat = await Socket.getChat(socket_id)
        const reply = await Socket.getChatInRoom(socket_id, 1)

        if (mainChat) {
            this.MainChat = mainChat
            this.Reply = reply
        }
    }

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

    static async getChat(socket_id) {
        const query = `
            SELECT socket_id, room_id, socket.user_id, user_name, avatar, content, timestamp
            FROM socket
                INNER JOIN users ON socket.user_id = users.user_id
            WHERE socket_id = $1
        `

        const number = parseInt(socket_id.replace(/\D/g, ''), 10);
        try {
            const result = await db.query(query, [number])
            const likeData = await Socket.countAllLikeInChat(number);
            const isLike = await Socket.checkLike(number);

            const chatData = result.rows[0];
            return {
                ...chatData,
                total_like: likeData.total_like,
                is_like: isLike
            };
        } catch (err) {
            console.error('Error take a chat by socket id:', err);
            throw err;
        }
    }

    static async addLike(socket_id, user_id) {
        const query = `
            INSERT INTO socket_likes (socket_id, user_id)
            VALUES ($1, $2)
            RETURNING *
        `
        try {
            const isLike = await Socket.checkLike(socket_id, user_id)
            if (isLike) {
                const result = await Socket.deleteLike(socket_id, user_id)
                return `Đã xoá like cho user ${user_id}`
            } else {
            const result = await db.query(query, [socket_id, user_id])
            return result.rows[0]
            }
        } catch (err) {
            console.error('Error adding new like to a commment:', err);
            throw err;
        }
    }

    static async deleteLike (socket_id, user_id){
        const query = `
            DELETE FROM socket_likes
            WHERE socket_id = $1
            AND user_id = $2
        `
        try {
            const result = await db.query(query, [socket_id, user_id])
            return result.rows[0]
        } catch (err) {
            console.error('Error delete like to a commment:', err);
            throw err;
        }
    }

    static async checkLike(socket_id, user_id){
        const query = `
            SELECT *
            FROM socket_likes
            WHERE socket_id = $1
            AND user_id = $2
        `
        try {
            const result = await db.query(query, [socket_id, user_id])
            if (result.rows[0]) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.error('Error checking like to a commment:', err);
            throw err;
        }
    }

    static async getChatInRoom(room_id, page, userID) {
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

            // Sử dụng Promise.all để đợi tất cả các hàm countAllReplyInAChat hoàn tất
            const data = await Promise.all(
                result.rows.map(async (data) => {
                    const replyCount = await Socket.countAllReplyInAChat(`Reply ${data.socket_id}`);
                    const likeCount = await Socket.countAllLikeInChat(data.socket_id)
                    const isLike = await Socket.checkLike(data.socket_id, userID)
                    return {
                        ...data,
                        total_reply: replyCount.total_reply,
                        total_like: likeCount.total_like,
                        is_like: isLike,
                    };
                })
            );

            return data;
        } catch (err) {
            console.error(`Error get chat in room ${room_id} :`, err);
            throw err;
        }
    }

    static async countAllReplyInAChat(room_id) {
        const query = `
            SELECT COUNT(*) AS total_reply
            FROM socket
            WHERE room_id = $1
        `
        try {
            const result = await db.query(query, [room_id])
            return result.rows[0]
        } catch (err) {
            console.error(`Error get total reply in room ${room_id} :`, err);
            throw err;
        }
    }

    static async countAllLikeInChat(socket_id){
        const query = `
            SELECT COUNT (*) AS total_like
            FROM socket_likes
            WHERE socket_id = $1
        `
        try {
            const result = await db.query(query, [socket_id])
            return result.rows[0]
        } catch (err) {
            console.error(`Error get total like for SocketID: ${socket_id} :`, err);
            throw err;
        }
    }
}

export default Socket