import express, { json, response } from "express";
import passport from "../../Model/passport.js";
import User from "../../Model/Person/User.js";

const InteractionController = express.Router();

InteractionController.post("/interaction", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const type = req.body.type
            const book_id = req.body.book_id
            const value = req.body.value ? req.body.value : "";
            const result = await User.updateUserInteraction(book_id, req.user.user_id, type, value)

            res.status(200).json({ result: true, message: `trạng thái tương tác ${type} được cập nhật`, user: result });
        } catch (err) {
            return res.status(500).json({ result: false, message: "lỗi tương tác", error: err.message })
        }
    });

// sử dụng
// post vào baseURL/User/interaction
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>
// truyền dữ liệu vào body:
// {
//     "type": string,
//     "book_id": string,
//     "Value": string
// }

export default InteractionController