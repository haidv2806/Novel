import express, { json, response } from "express";
import passport from "../../Model/passport.js";
import User from "../../Model/Person/User.js";
import bcrypt, { hash } from "bcrypt"

const Auth = express.Router();

Auth.post("/sign_in", async (req, res, cb) => {
  passport.authenticate("login", (err, token, user, info) => {
    if (err) {
      return res.status(500).json({ result: false, error: err.message });
    }
    if (!user) {
      // Nếu không có user, trả về result: false với message từ info hoặc thông báo mặc định
      return res.status(401).json({ result: false, message: info?.message || 'Đăng nhập thất bại' });
    }
    // Nếu token không hợp lệ hoặc là false, trả về result: false
    if (!token) {
      return res.status(401).json({ result: false, message: 'Xác thực thất bại' });
    }

    // Đăng nhập thành công
    res.json({ result: true, message: 'đã xác thực', token: token, user });
  })(req, res, cb);
});

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "email": string,
//   "password": string
// }

Auth.post("/sign_up", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        result: false,
        message: "Tên, email, hoặc mật khẩu không được để trống.",
      });
    }

    const checkEmail = await User.findByEmail(email);

    if (checkEmail) {
      return res.status(401).json({
        result: false,
        message: "Email đã tồn tại, vui lòng đăng nhập.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create(email, hashedPassword, name);
    return res.status(201).json({ result: true, message: "Đăng ký thành công!", user: result });
  } catch (err) {
    return res.status(500).json({
      result: false,
      message: "Đăng ký không thành công.",
      error: err.message,
    });
  }
});

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "name": string,
//   "email": string,
//   "password": string
// }

// Route để khởi động quá trình Google OAuth
Auth.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route callback sau khi Google xác thực thành công
// Auth.get(
//   "/google/callback",
//   (req, res, next) => {
//     passport.authenticate(  passport.authenticate("google"),(err, user, token, info) => {

//       if (err) {
//         return res.status(500).json({ result: false, message: "Xác thực thất bại", error: err.message });
//       }
//       if (!user) {
//         return res.status(401).json({ result: false, message: "Xác thực thất bại, vui lòng thử lại." });
//       }

//       res.status(200).json({
//         result: true,
//         message: "Đăng nhập bằng Google thành công",
//         token,
//         user,
//       });
//     })(req, res, next);
//   }
// );

Auth.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user,token, info) => {
      if (err || !user) {
        return res.redirect("http://localhost:4000/login");
      }
      const email = user.email 
      const userName = user.user_name
      
      // Redirect với token kèm theo
      res.redirect(`http://localhost:4000/?email=${email}&userName=${userName}`);
    })(req, res, next);
  }
);


// Route xử lý yêu cầu gia hạn token
Auth.post(
  "/token",
  (req, res, next) => {
    passport.authenticate("token", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({
          result: false,
          message: "Đã xảy ra lỗi trong quá trình gia hạn token.",
          error: err.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          result: false,
          message: info?.message || "Xác thực không thành công. Vui lòng đăng nhập lại.",
        });
      }

      // Sau khi xác thực thành công, passport sẽ gửi dữ liệu access token mới qua user
      return res.status(200).json({
        result: true,
        message: "Gia hạn token thành công",
        accessToken: user.accessToken,
      });
    })(req, res, next); // Gọi hàm authenticate với req, res, next
  }
);

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "refreshToken": <token>
// }

Auth.get("/protected", passport.authenticate('jwt', { session: false, optional: false }),
    async (req, res, cb) => {
      try {
            res.status(200).json({ result: true, message: 'đăng nhập thành công', user: req.user });
        } catch (err) {
            return res.status(500).json({ result: false, message: "đăng nhập không thành công", error: err.message })
        }
    });

export default Auth