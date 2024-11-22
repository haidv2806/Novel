import express, { json, response} from "express";
import session from "express-session";
import env from "dotenv";
import cors from "cors";
import path from 'path';

import InteractionController from "./Service/User/InteractionController.js";
import Auth from "./Service/Auth/AuthController.js";
import UserController from "./Service/User/UserController.js";
import BookController from "./Service/Books/BookController.js";
import VolumeController from "./Service/Books/VolumeController.js";
import ChapterController from "./Service/Books/ChapterController.js";
import SocketController from "./Service/Socket/SocketController.js";

import { server, app, io } from "./Service/Socket/SocketChatController.js"

env.config();
// const app = express();
const port = 3000;


app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      }
    })
);

// Cấu hình CORS để hỗ trợ Socket.io
app.use(cors({origin: true, credentials: true}));

// Middleware để xử lý dữ liệu dạng URL-encoded và JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/image', express.static(path.join(process.env.PATH_SAVE_IMAGE)));

app.use("/Auth", Auth);
app.use("/User", UserController);
app.use("/User", InteractionController);
app.use("/Socket", SocketController);
app.use("/Book", BookController);
app.use("/Book/Volume", VolumeController);
app.use("/Book/Volume/Chapter", ChapterController);


// Khởi động server HTTP để lắng nghe trên cổng 3000
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});