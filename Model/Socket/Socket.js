import db from '../../Service/database.js'

class Socket {
    MainChat
    // socket_id
    // room_id
    // user_id
    // avatar
    // content
    // timestamp
    Reply

    constructor (){
        this.Reply =[]
    }

    // lấy dữ liệu cho 1 group chat của reply
    async init(socket_id){
        const mainChat = await Socket.getChat(socket_id)
        const reply = await Socket.getChatInRoom(socket_id, 1)
        console.log(reply);
        

        if (mainChat) {
            this.MainChat = mainChat
            // this.socket_id = mainChat.socket_id
            // this.room_id = mainChat.room_id
            // this.user_id = mainChat.user_id
            // this.avatar = mainChat.avatar
            // this.content = mainChat.content
            // this.timestamp = mainChat.timestamp
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

    static async getChat(socket_id){
        const query = `
            SELECT socket_id, room_id, socket.user_id, user_name, avatar, content, timestamp
            FROM socket
                INNER JOIN users ON socket.user_id = users.user_id
            WHERE socket_id = $1
        `

        const number = parseInt(socket_id.replace(/\D/g, ''), 10);
        try {
            const result = await db.query(query, [number])
            return result.rows[0]
        } catch (err) {
            console.error('Error take a chat by socket id:', err);
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
    
    static async getAllReplyFromSocketId(socket_id, page){
        const query = `
            SELECT *
            FROM socket_replies
            WHERE socket_id = $1
            ORDER BY timestamp DESC
            LIMIT 10 OFFSET $2
        `
        try {
            const result = await db.query(query, [socket_id, (page * 10) - 10])
            return result.rows
        } catch (error) {
            console.error(`Error get all chat in socket_id ${socket_id} room:`, err);
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
            console.log(room_id);
            
            return result.rows
        } catch (err) {
            console.error(`Error get chat in room ${room_id} :`, err);
            throw err;
        }
    }
}

export default Socket