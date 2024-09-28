import express, { json, response } from "express";
import passport from "../../Model/passport.js";
import User from "../../Model/Person/User.js";
import bcrypt, { hash } from "bcrypt"

const Auth = express.Router();

Auth.post("/sign_in", async (req, res, cb) => {
    passport.authenticate("login", (err, token, user, info) => {
        if (err) {
            return res.status(500).json({ result: false, error: err.message });
        }
        if (!user) {
            // Nếu không có user, trả về result: false với message từ info hoặc thông báo mặc định
            return res.status(401).json({ result: false, message: info?.message || 'Đăng nhập thất bại' });
        }
        console.log(user);
        // Nếu token không hợp lệ hoặc là false, trả về result: false
        if (!token) {
            return res.status(401).json({ result: false, message: 'Xác thực thất bại' });
        }

        // Đăng nhập thành công
        res.json({ result: true, message: 'đã xác thực', token: `Bearer ${token}`, user });
    })(req, res, cb);
});

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "email": string,
//   "password": string
// }

Auth.post("/sign_up", async (req, res, cb) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        // kiểm tra xem email đã được dùng chưa
        const checkEmail = await User.findByEmail(email)

        if (checkEmail) {
            return res.status(401).json({ result: false, message: "Email đã tồn tại, vui lòng đăng nhập." });

        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ result: false, message: "Lỗi khi mã hóa mật khẩu.", error: err });
                } else {
                    const result = await User.create(email, hash, name)
                    return res.status(201).json({ result: true, message: "Đăng ký thành công!", result })
                }
            });
        }
    } catch (err) {
        return res.status(500).json({ result: false, message: "đăng ký không thành công", error: err.message });
    }
});

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "name": string,
//   "email": string,
//   "password": string
// }

export default Auth