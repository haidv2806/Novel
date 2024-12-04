import express, { json, response } from "express";
import passport from "../../Model/passport.js";
import User from "../../Model/Person/User.js";
import upload from '../../Model/multer.js';

const UserController = express.Router();

//thay avartar
UserController.post("/avatar", passport.authenticate('jwt', { session: false, optional: false }), upload.single('avatar'),
    async (req, res, cb) => {
        let avatarUrl = null;

        try {
            // Nếu người dùng đã upload file avatar, tạo URL cho ảnh
            if (!req.file) {
                return res.status(500).json({ result: false, message: "bạn đang không đính kèm bất kỳ tệp tin nào" })
            } else {
                avatarUrl = `${req.protocol}://${req.get('host')}/image/${req.file.filename}`;
            }
            const result = await User.updateNewAvatar(req.user.user_id, avatarUrl)

            res.status(200).json({ result: true, message: 'thay đổi avatar thành công', user: result });
        } catch (err) {
            // Xử lý lỗi khi không phải ảnh
            if (err.message === 'Only images are allowed') {
                return res.status(400).json({ result: false, message: "Sai định dạng file. Vui lòng tải lên tệp ảnh." });
            }
            return res.status(500).json({ result: false, message: "Không thay đổi avatar", error: err.message })
        }
    });

// Sử dụng
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>
// truyền dữ liệu vào body:
// {
//   "avatar": file jpeg|jpg|png
// }


//thay tên
UserController.post("/name", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const name = req.body.name
            if (!name){
                res.status(400).json({ result: false, message: 'Không tồn tại trường name'});
            }
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

UserController.get("/followedBook", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const page = req.query.page || 1
            const result = await User.checkFollowedBooks(req.user.user_id, page)

            res.status(200).json({ result: true, message: 'tìm sách đã follow thành công', Books: result });
        } catch (err) {
            return res.status(500).json({ result: false, message: "Không tìm được sách đã follow của người dùng", error: err.message })
        }
    });



export default UserController