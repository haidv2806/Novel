import passport from "passport";
import { Strategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import env from "dotenv";

import User from "./Person/User.js";
import RefreshToken from './RefreshToken.js';

env.config();
const secretOrKey = process.env.SECRET_AUTH_TOKEN_KEY
const expiresToken = process.env.EXPIRES_TOKEN
const expiresRefreshToken = process.env.EXPIRES_REFRESH_TOKEN

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
        const user = new User()
        await user.init(checkEmail.user_id)
        const valid = await user.comparePassword(password)

        if (valid) {
          const refreshToken = await refreshTokenGenerate(user.user_id)
          const accessToken = await accessTokenGenerate(user)

          await RefreshToken.create(refreshToken, user.user_id)

          const token = {
            refreshToken: refreshToken,
            accessToken: accessToken,
          }
          return cb(null, token, user);
        } else {
          return cb(null, false, { message: 'Sai mật khẩu' });
        }
      } else {
        return cb(null, false , null, { message: 'Không tồn tại người dùng' })
      }

    } catch (err) {
      console.log(err);
    }
  })
);

// đăng nhập bằng google
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:3000/Auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value;

        const result = await User.findByEmail(email);
        if (!result) {
          const newUser = await User.create(
            email,
            "google", // Set mặc định cho tài khoản Google
            profile.displayName
          );

          const refreshToken = await refreshTokenGenerate(newUser.user_id)
          const accessToken = await accessTokenGenerate(newUser)

          await RefreshToken.create(refreshToken, newUser.user_id)

          const token = {
            refreshToken: refreshToken,
            accessToken: accessToken,
          }

          console.log("Tạo tài khoản Google thành công!");
          return cb(null, newUser, token);
        } else {
          const refreshToken = await refreshTokenGenerate(result.user_id)
          const accessToken = await accessTokenGenerate(result)

          await RefreshToken.create(refreshToken, result.user_id)

          const token = {
            refreshToken: refreshToken,
            accessToken: accessToken,
          }

          return cb(null, result, token);
        }
      } catch (err) {
        console.error("Google OAuth error:", err);
        return cb(err);
      }
    }
  )
);

passport.use(
  "token",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"), // Lấy refresh token từ body request
      secretOrKey: secretOrKey,
      passReqToCallback: true,
    },
    async (req, payload, done) => {

      try {
        // Lấy refresh token từ body
        const refreshToken = req.body.refreshToken;

        // Kiểm tra xem refresh token có hợp lệ hay không
        const isValid = await RefreshToken.findOne(refreshToken);

        if (isValid) {
          // Xác thực và kiểm tra tính hợp lệ của refresh token
          const user = await User.findById(payload.user_id); // Tìm người dùng dựa trên payload từ refresh token

          if (!user) {
            return done(null, false, { message: "Người dùng không tồn tại" });
          }

          // Tạo mới access token
          const newAccessToken = await accessTokenGenerate({
            user_id: user.user_id,
            email: user.email,
            user_name: user.user_name,
          });

          // Trả về access token mới
          return done(null, { accessToken: newAccessToken }, { message: "Gia hạn token thành công" });
        } else {
          return done(null, false, { message: "refeshToken không tồn tại" });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

async function accessTokenGenerate(data) {
  const payload = { user_id: data.user_id, email: data.email, name: data.user_name };
  const accessToken = jwt.sign(payload, secretOrKey, { expiresIn: expiresToken });
  return accessToken
}

async function refreshTokenGenerate(id) {
  const payload = { user_id: id };
  const refreshToken = jwt.sign(payload, secretOrKey, { expiresIn: expiresRefreshToken });
  return refreshToken
}

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
