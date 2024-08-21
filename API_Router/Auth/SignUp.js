import express, { json, response} from "express";
import db from "../database.js";
import bcrypt from "bcrypt"
import env from "dotenv";

env.config();

const SignUp = express.Router();

SignUp.post("/sign_up", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // kiểm tra xem email đã được dùng chưa
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      return res.json({ result: false, message: "Email đã tồn tại, vui lòng đăng nhập." });

    } else {
        bcrypt.hash(password, 10, async (err, hash) => {

          if (err) {
            return res.status(500).json({ result: false, message: "Lỗi khi mã hóa mật khẩu.", error: err });
          } else {
            const result = await db.query(
              "INSERT INTO users (email, password, displayname, picture) VALUES ($1, $2, $3, $4) RETURNING *",
              [email, hash, "user", process.env.Default_Image]
            );
            const user = result.rows[0];

            return res.json({result: true, message: "Đăng ký thành công!", user})
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