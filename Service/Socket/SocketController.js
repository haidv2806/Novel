import express from "express";
import passport from "../../Model/passport.js";
import Socket from "../../Model/Socket/Socket.js";

const SocketController = express.Router()

SocketController.post("/like", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const socketID = req.body.socketID     
            const userID = req.user.user_id
            if(!socketID){
                return res.status(400).json({ result: false, message: "thiếu truong socketID"});
            }

            const result = await Socket.addLike(socketID, userID)

            res.status(200).json({ result: true, message: `đã thêm cập nhật like cho SocketID ${socketID}`, Comment: result });
        } catch (err) {
            return res.status(500).json({ result: false, message: "lỗi không cập nhật được like", error: err.message })
        }
    });

// sử dụng
// post vào baseURL/Socket/like
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>
// truyền dữ liệu vào body:
// {
//     "socketID": int
// }

SocketController.get("/room", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const roomID = req.query.roomID
            const page = req.query.page || 1
            const userID = req.user.user_id
            if(!roomID){
                return res.status(400).json({ result: false, message: "thiếu truong roomID"});
            }

            const result = await Socket.getChatInRoom(roomID, page, userID)

            res.status(200).json({ result: true, message: `lấy dữ liệu từ roomID thành công`, Comment: result });
        } catch (err) {
            return res.status(500).json({ result: false, message: "lỗi không lấy được dữ liệu từ roomID", error: err.message })
        }
    });

// sử dụng
// get vào baseURL/Socket/room?roomID=<string>&page=<int>
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>


export default SocketController