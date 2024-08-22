import express, { json, response} from "express";
import passport from "../../Model/passport.js";
const SignIn = express.Router();

SignIn.post("/sign_in", async (req, res, cb) => {
    passport.authenticate("login", (err, token, user, info) => {
        if (err) {
          return res.status(500).json({ result: false, error: err.message });
        }
        if (!user) {
          return res.status(401).json({ result: false, message: info.message });
        }
        // Đăng nhập thành công  
        res.json({ result: true, message: 'Authenticated', token: `Bearer ${token}`, user });
      })(req, res, cb);
});

export default SignIn

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "email": "user@example.com",
//   "password": "password123"
// }