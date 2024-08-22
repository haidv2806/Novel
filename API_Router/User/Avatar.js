import express, { json, response } from "express";
import passport from "../Auth/passport.js";
import User from "../../Model/User.js";

const Avatar = express.Router();

Avatar.post("/avatar", passport.authenticate('jwt', { session: false, optional: false }),
  async (req, res, cb) => {
    try {
      const picture = req.body.picture
      const result = await User.updateNewAvatar(req.user.userid, picture)

      res.status(200).json({ result: true, message: 'Avatar uploaded successfully', user: result });
    } catch (error) {
      return res.status(500).json({ result: false, message: "Không thay đổi avatar" })
    }
  });

export default Avatar

// Sử dụng
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>
// truyền dữ liệu vào body:
// {
//   "picture": base64
// }