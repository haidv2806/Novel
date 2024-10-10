import express from "express";
import http from 'http';
import { Server } from "socket.io";
import passport from "../../Model/passport.js";

const app = express();

// Tạo server HTTP bằng cách kết hợp với Express app
const server = http.createServer(app);

// Cấu hình socket.io với server HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn (chỉnh lại nếu cần)
    methods: ["GET", "POST"]
  }
});

// Định nghĩa một namespace cụ thể
const newsSocketNamespace = io.of('/Socket');

// kiểm tra token
// Middleware để sử dụng passport xác thực access token
newsSocketNamespace.use((socket, next) => {
  const token = socket.handshake.auth.accessToken || socket.handshake.query.accessToken; // Lấy token từ query hoặc auth

  if (!token) {
    return next(new Error('Authentication error: Token is required'));
  }

  // Tạo một request ảo để dùng cho passport
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };

  // Passport-JWT xử lý xác thực
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return next(new Error('Authentication error: Invalid token'));
    }

    socket.user = user;  // Lưu thông tin người dùng đã xác thực
    next();              // Tiếp tục kết nối nếu token hợp lệ
  })(req);
});


// Sự kiện khi có kết nối socket mới
newsSocketNamespace.on('connection', (socket) => {
  console.log("User connected:", socket.user.user_name);

  socket.on('send_message', (data) => {
    console.log(data);

    // Emit tin nhắn tới tất cả kết nối trong namespace
    newsSocketNamespace.emit("receive_message", {
      id: socket.id,
      userImage: "https://fastly.picsum.photos/id/99/536/354.jpg?hmac=TAjl9K8MlAuXK5gnvATXTmOHkoN7bOjyqto5Qhxn1Cg",
      userName: "Olivia White",
      userComment: data.message,
    });
  });

  // Xử lý khi socket ngắt kết nối
  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export server và io để sử dụng ở các nơi khác
export { server, app, io };