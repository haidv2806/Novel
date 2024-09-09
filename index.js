import express, { json, response} from "express";
import session from "express-session";
import env from "dotenv";


import Auth from "./API_Router/Auth/AuthController.js";
import Avatar from "./API_Router/User/Avatar.js";
import Name from "./API_Router/User/Name.js";
import BookController from "./API_Router/BookController/BookController.js";
import VolumeController from "./API_Router/BookController/VolumeController.js";
import ChapterController from "./API_Router/BookController/ChapterController.js";


env.config();
const app = express();
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
  )

  
// Middleware để xử lý dữ liệu dạng URL-encoded và JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/Auth", Auth)
app.use("/User", Avatar)
app.use("/User", Name)
app.use("/Book", BookController)
app.use("/Book/Volume", VolumeController)
app.use("/Book/Volume/Chapter", ChapterController)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });