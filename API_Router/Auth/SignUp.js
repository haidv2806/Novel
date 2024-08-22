import express, { json, response} from "express";
import bcrypt from "bcrypt"
import env from "dotenv";
import User from "../../Model/User.js";

env.config();

const SignUp = express.Router();

SignUp.post("/sign_up", async (req, res, cb) => {
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
            const result = await User.create(email, hash)

            return res.status(201).json({result: true, message: "Đăng ký thành công!", result})
          }
        });
    }
  } catch (err) {
    return res.status(500).json({ result: false, message: "Đã xảy ra lỗi", error: err });
  }
});

  
export default SignUp

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "email": "user@example.com",
//   "password": "password123"
// }