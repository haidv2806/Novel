import express, { json, response } from "express";
import passport from "../../Model/passport.js";
import User from "../../Model/Person/User.js";

const UserController = express.Router();

//thay avartar
UserController.post("/avatar", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const picture = req.body.picture
            const result = await User.updateNewAvatar(req.user.user_id, picture)

            res.status(200).json({ result: true, message: 'New avatar uploaded successfully', user: result });
        } catch (err) {
            return res.status(500).json({ result: false, message: "Không thay đổi avatar", error: err.message })
        }
    });

// Sử dụng
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>
// truyền dữ liệu vào body:
// {
//   "picture": base64
// }


//thay tên
UserController.post("/name", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const name = req.body.name
            const result = await User.updateNewName(req.user.user_id, name)

            res.status(200).json({ result: true, message: 'New name uploaded successfully', user: result });
        } catch (err) {
            return res.status(500).json({ result: false, message: "Không thay đổi được tên người dùng", error: err.message })
        }
    });

// Sử dụng
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>
// truyền dữ liệu vào body:
// {
//   "name": string
// }

UserController.get("/bookMark", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const page = req.params.page || 1     
            const result = await User.checkBookMark(req.user.user_id, page)

            res.status(200).json({ result: true, message: 'tìm bookMark thành công', user: req.user, books: result });
        } catch (err) {
            return res.status(500).json({ result: false, message: "Không tìm được bookMark của người dùng", error: err.message })
        }
    });



export default UserController