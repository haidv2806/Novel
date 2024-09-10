import express, { json, response } from "express";
import passport from "../../Model/passport.js";
import User from "../../Model/Person/User.js";

const Name = express.Router();

Name.post("/name", passport.authenticate('jwt', { session: false, optional: false }),
  async (req, res, cb) => {
    try {
      const name = req.body.name
      const result = await User.updateNewName(req.user.user_id, name)

      res.status(200).json({ result: true, message: 'New name uploaded successfully', user: result });
    } catch (err) {
      return res.status(500).json({ result: false, message: "Không thay đổi được tên người dùng", error: err.message})
    }
  });

export default Name

// Sử dụng
//truyền dữ liệu và header:
//Authorization: Bearer <AuthToken>
// truyền dữ liệu vào body:
// {
//   "name": string
// }