import express from "express";
import https from 'https';
import http from 'http';
import { Server } from "socket.io";
import passport from "../../Model/passport.js";
import fs from "fs"

import Socket from '../../Model/Socket/Socket.js';

const app = express();

const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}

// Tạo server HTTP bằng cách kết hợp với Express app
// const server = https.createServer( httpsOptions, app);
const server = http.createServer(app);

// Cấu hình socket.io với server HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn (chỉnh lại nếu cần)
    methods: ["GET", "POST"]
  }
});

// Định nghĩa một namespace cụ thể
const newsSocketNamespace = io.of('/SocketChat');

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

  // Xử lý sự kiện join_room
  socket.on('join_room', async (roomID) => {
    if (roomID && typeof roomID == 'string' && roomID.startsWith('Reply')) {
      try {
        socket.join(roomID); // Tham gia vào phòng cụ thể
        console.log(`User ${socket.user.user_name} joined room ${roomID}`);

        // Lấy dữ liệu chat trong phòng từ cơ sở dữ liệu
        const socketdata = new Socket()
        await socketdata.init(roomID)

        // Gửi dữ liệu chat về cho người dùng vừa tham gia phòng
        socket.emit('room_data', socketdata);  // Trả dữ liệu chat cho chính socket này
      } catch (err) {
        console.error('Error fetching reply data:', err);
        socket.emit('error', { message: 'Không thể lấy dữ liệu chat cho phòng reply này' });
      }

    } else {
      try {
        socket.join(roomID); // Tham gia vào phòng cụ thể
        console.log(`User ${socket.user.user_name} joined room ${roomID}`);

        // Lấy dữ liệu chat trong phòng từ cơ sở dữ liệu
        const result = await Socket.getChatInRoom(roomID, 1);
        
        // Gửi dữ liệu chat về cho người dùng vừa tham gia phòng
        socket.emit('room_data', {MainChat: result});  // Trả dữ liệu chat cho chính socket này
      } catch (err) {
        console.error('Error fetching chat data:', err);
        socket.emit('error', { message: 'Không thể lấy dữ liệu chat cho phòng này' });
      }
    }
  });

  // Xử lý khi nhận tin nhắn từ client
  socket.on('send_message', async ({ message, roomID }) => {
    console.log(roomID);
    console.log(message);
    
    
      try {
        // lưu và cơ sở dữ liệu 
        const chat = await Socket.addNewChat(roomID, socket.user.user_id, message)
        // Gửi tin nhắn tới tất cả các client trong cùng một phòng
        newsSocketNamespace.emit("receive_message", {
          socket_id: chat.socket_id,
          room_id: chat.room_id,
          user_id: chat.user_id,
          user_name: socket.user.user_name,
          avatar: socket.user.avatar,
          content: chat.content,
          timestamp: chat.timestamp
        });
      } catch (err) {
        console.error('Error save chat data:', err);
        socket.emit('error', { message: 'không thể lưu trữ dữ liệu' });
      }
  });

  // Xử lý khi socket ngắt kết nối
  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

export { server, app, io };