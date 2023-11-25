import express from "express";
import morgan from "morgan";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js"
import cors from "cors";
// cors는 post를 보낼때 400에러를 뛰어서 blockking
import { config } from "./config.js";
// dotenv.config();
import { initSocket } from "./connection/socket.js";
import { connectDB } from "./db/database.js";

// console.log(process.env.JWT_SECRET);
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// 라우터
app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
})

connectDB().then(() => {
    const server = app.listen(config.host.port);
    initSocket(server);
}).catch(console.error);
