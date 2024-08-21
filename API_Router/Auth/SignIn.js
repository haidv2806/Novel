import express, { json, response} from "express";
import passport from "./passport.js";

const SignIn = express.Router();

SignIn.post("/sign_in", async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
          return res.status(500).json({ result: false, error: err.message });
        }
        if (!user) {
          return res.status(401).json({ result: false, message: info.message });
        }
        // Đăng nhập thành công
        return res.status(200).json({result: true, message: "Đăng nhập thành công", user });
      })(req, res, next);
});

export default SignIn

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "email": "user@example.com",
//   "password": "password123"
// }