import dotenv from "dotenv";
dotenv.config();

import express from "express";
let app = express();
const port = process.env.PORT;

import newRouter from "./Routes/newsRouter";

app.use("/news", newRouter);

import mongoose from "mongoose";

import chalk from "chalk";

try {
    app.listen(port, () => console.log(chalk.green.bold(`server started on port ${port}`)));
    mongoose
        .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.dvfjqpc.mongodb.net/flurr`)
        .then((res) => console.log(chalk.green.bold("Connected to DB")));
} catch (error) {
    console.log(error);
}

import Chat from "./Models/Chat";
import New from "./Models/New";
import User from "./Models/User";
