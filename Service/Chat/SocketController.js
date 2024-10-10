import express from "express";
import http from 'http';
import { Server } from "socket.io";
// import { server } from "../../index.js";

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

// Sự kiện khi có kết nối socket mới
newsSocketNamespace.on('connection', (socket) => {
  console.log("User connected to /Socket:", socket.id);

  socket.on('send_message', (data) => {
    console.log(data);
    
    // Emit tin nhắn tới tất cả kết nối trong namespace
    newsSocketNamespace.emit("receive_message", data);
  });

  // Xử lý khi socket ngắt kết nối
  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export server và io để sử dụng ở các nơi khác
export { server, app, io };