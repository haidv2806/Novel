import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "./Person/User.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import jwt from 'jsonwebtoken';
import env from "dotenv";

env.config();
const secretOrKey = process.env.SECRET_AUTH_TOKEN_KEY
const expiresToken = process.env.EXPIRES_TOKEN

passport.use(
  "login",
  new Strategy({
    usernameField: 'email', // Sử dụng email làm username
    passwordField: 'password' // Trường mật khẩu
  }, async function verify(email, password, cb) {

    try {
      //kiểm tra xem có email ko
      const checkEmail = await User.findByEmail(email)

      if (checkEmail) {
        const storedHashedPassword = checkEmail.password;   
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              const payload = { user_id: checkEmail.user_id, email: checkEmail.email };
              const token = jwt.sign(payload, secretOrKey, { expiresIn: expiresToken });
              return cb(null, token ,checkEmail);
            } else {
              return cb(null, false);
            }
          }
        });

      } else {
        return cb(null, false, { message: 'Email không tồn tại' });
      }
    } catch (err) {
      console.log(err);
    }
  })
);

// JWT strategy
const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretOrKey, // Replace with your secret key
};


passport.use(new JwtStrategy(option, async (payload, cb) => {
  try {
    const user = await User.findById(payload.user_id);
    if (user) {
      return cb(null, user);// xác thực thành công
    } else {
      return cb(null, false);// không thấy người dùng
    }
  } catch (err) {
    return cb(err, false);// xử lý lỗi
  }
}));

export default passport;
