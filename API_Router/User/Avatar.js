import express, { json, response } from "express";
import db from "../database.js";
import passport from "../Auth/passport.js";

const Avatar = express.Router();

Avatar.post("/avatar", async (res, req) => {
    const picture = req.body.picture
    const email = req.body.email

    //đăng nhập
    await passport.authenticate("local", async (err, user, info) => {
        if (err) {
            return res.status(500).json({ result: false, error: err.message });
        }
        if (!user) {
            return res.status(401).json({ result: false, message: info.message });
        }
        // Đăng nhập thành công
        // set avatar mới
        try {
            const result = await db.query(
                "UPDATE users SET picture = $1 WHERE email = $2 RETURNING *",
                [picture, email]
            );

            return res.json({ result: true, message: "Thay ảnh đại diện thành công", data: result.rows[0] });
        } catch (updateErr) {
            return res.status(500).json({ result: false, message: "lỗi thay ảnh đại diện", error: updateErr.message });
        }

    })(req, res);
})

export default Avatar

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "email": "user@example.com",
//   "password": "password123"
//   "picture": base64
// }