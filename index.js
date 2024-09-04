import express, { json, response} from "express";
import session from "express-session";
import env from "dotenv";

import SignUp from "./API_Router/Auth/SignUp.js";
import SignIn from "./API_Router/Auth/SignIn.js";
import Avatar from "./API_Router/User/Avatar.js";
import Name from "./API_Router/User/Name.js";
import BookController from "./API_Router/BookController/BookController.js";
import VolumeController from "./API_Router/BookController/VolumeController.js";


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


app.use(express.json());

app.use("/Auth", SignUp)
app.use("/Auth", SignIn)
app.use("/User", Avatar)
app.use("/User", Name)
app.use("/Book", BookController)
app.use("/Book/Volume", VolumeController)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });