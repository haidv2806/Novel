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

            if(!type){
                res.status(400).json({ result: false, message: `yêu cầu phải có trạng thái tương tác`});
            } else if (!book_id) {
                res.status(400).json({ result: false, message: `yêu cầu phải có id của sách được tương tác`});
            }
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

InteractionController.get("/isFollow", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const book_id = req.query.bookId
            const result = await User.isUserFollowBook(book_id, req.user.user_id)
            let isFollow = false

            if(result != false){
                isFollow = true
            }

            res.status(200).json({ result: true, message: "kiểm tra người dùng có theo dõi sách thành công", is_follow: isFollow });
        } catch (err) {
            return res.status(500).json({ result: false, message: "lỗi tương tác", error: err.message })
        }
});
// sử dụng
// get vào baseURL/User/isFollow?bookId=<INT>
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>

InteractionController.get("/isRated", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
        try {
            const book_id = req.query.bookId
            const result = await User.isUserRatedBook(book_id, req.user.user_id)
            let isRated = false

            if(result != false){
                isRated = true
            }

            res.status(200).json({ result: true, message: "kiểm tra người dùng có đánh giá sách thành công", is_rated: isRated });
        } catch (err) {
            return res.status(500).json({ result: false, message: "lỗi tương tác", error: err.message })
        }
});

// sử dụng
// get vào baseURL/User/isFollow?bookId=<INT>
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>

export default InteractionController