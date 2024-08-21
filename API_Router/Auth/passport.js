import bcrypt from "bcrypt";
import db from "../database.js";
import passport from "passport";
import { Strategy } from "passport-local";

passport.use(
    "local",
    new Strategy({
        usernameField: 'email', // Sử dụng email làm username
        passwordField: 'password' // Trường mật khẩu
      },async function verify(email, password, cb) {
        console.log(email);
        console.log(password);
        
        
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
                return cb(null, user);
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

export default passport