import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";

import chalk from "chalk";

import { Chat, IChat } from "./Models/Chat";
import { New, INew } from "./Models/New";
import { User, IUser } from "./Models/User";

import newRouter from "./Routes/newsRouter";
import authRouter from "./Routes/authRouter";

import { authCheck } from "./Middlewares/authCheck";

let app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(authCheck)

app.use("/news", newRouter);
app.use("/auth", authRouter);


try {
    app.listen(port, () => console.log(chalk.green.bold(`server started on port ${port}`)));
    mongoose
        .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.dvfjqpc.mongodb.net/flurr`)
        .then((res) => console.log(chalk.green.bold("Connected to DB")));
} catch (error) {
    console.log(error);
}


