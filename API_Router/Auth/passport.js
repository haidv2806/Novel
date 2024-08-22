import bcrypt from "bcrypt";
import db from "../database.js";
import passport from "passport";
import { Strategy } from "passport-local";
import AuthTokenStrategy from "passport-auth-token"
import AccessToken from "../../Model/AccessToken.js";
import User from "../../Model/User.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import jwt from 'jsonwebtoken';
import env from "dotenv";

env.config();
const secretOrKey = process.env.SECRET_AUTH_TOKEN_KEY

passport.use(
  "local",
  new Strategy({
    usernameField: 'email', // Sử dụng email làm username
    passwordField: 'password' // Trường mật khẩu
  }, async function verify(email, password, cb) {

    try {
      //kiểm tra xem có email ko
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        email,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              const payload = { id: user.id, username: user.username };
              const token = jwt.sign(payload, secretOrKey, { expiresIn: '1h' });
              return cb(null, token ,user);
            } else {
              return cb(null, false);
            }
          }
        });

      } else {
        return cb("không có email");
      }
    } catch (err) {
      console.log(err);
    }
  })
);


// AuthToken strategy
passport.use('authtoken', new AuthTokenStrategy(
  async function (token, done) {
    try {
      const accessToken = await AccessToken.findOne({ id: token });
      if (accessToken) {
        if (!token.isValid(accessToken)) {
          return done(null, false);
        }
        const user = await User.findOne({ id: accessToken.userId });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error);
    }
  }
));

// JWT strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretOrKey, // Replace with your secret key
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;