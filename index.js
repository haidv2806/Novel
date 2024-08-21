import express, { json, response} from "express";
import session from "express-session";
import env from "dotenv";

import SignUp from "./API_Router/Auth/SignUp.js";
import SignIn from "./API_Router/Auth/SignIn.js";
import Avatar from "./API_Router/User/Avatar.js";


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

app.use("/", SignUp)
app.use("/", SignIn)
app.use("/", Avatar)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });