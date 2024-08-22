import express, { json, response} from "express";
import passport from "./passport.js";
import jwt from 'jsonwebtoken';
import env from "dotenv";

env.config();
const secretOrKey = process.env.SECRET_AUTH_TOKEN_KEY
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
        // return res.status(200).json({result: true, message: "Đăng nhập thành công", user });

        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, secretOrKey, { expiresIn: '1h' });
    
        res.json({ result: true, message: 'Authenticated', token: token, user });
      })(req, res, next);
});

export default SignIn

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "email": "user@example.com",
//   "password": "password123"
// }