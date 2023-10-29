"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
let app = (0, express_1.default)();
const port = process.env.PORT;
const newsRouter_1 = __importDefault(require("./Routes/newsRouter"));
app.use("/news", newsRouter_1.default);
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
try {
    app.listen(port, () => console.log(chalk_1.default.green.bold(`server started on port ${port}`)));
    mongoose_1.default
        .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.dvfjqpc.mongodb.net/flurr`)
        .then((res) => console.log(chalk_1.default.green.bold("Connected to DB")));
}
catch (error) {
    console.log(error);
}
