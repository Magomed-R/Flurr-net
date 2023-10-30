"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let accessTokenKey = process.env.ACCESS_TOKEN_SECRET || "";
const express_1 = require("express");
let authRouter = (0, express_1.Router)();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../Models/User");
authRouter.route("/").get(function (req, res) {
    res.sendStatus(200);
});
authRouter.route("/login").post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, password } = req.body;
        let user = yield User_1.User.findOne({ username: username });
        if (!user)
            res.sendStatus(401);
        else if (!(yield bcryptjs_1.default.compare(password, user.password)))
            res.sendStatus(403);
        else {
            let data = jsonwebtoken_1.default.sign({ id: user._id }, accessTokenKey);
            res.send(data);
        }
    });
});
authRouter.route("/signup").post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, password, email } = req.body;
        if (password.length < 4)
            return res.sendStatus(403);
        if (!username || !email || !password)
            return res.sendStatus(405);
        const hashedPassword = yield bcryptjs_1.default.hash(password, 7);
        let user = yield User_1.User.findOne({ username: username });
        if (!user) {
            let NewUser = new User_1.User({
                username: username,
                password: hashedPassword,
                email: email,
                aboutme: ``,
                avatar: ``,
                gender: ``,
                admin: false,
                birthday: null,
                likedNews: [],
                friends: [],
                chats: [],
            });
            yield NewUser.save();
            user = yield User_1.User.findOne({ username: username });
            if (user) {
                let data = { id: user._id };
                const accessToken = jsonwebtoken_1.default.sign(data, accessTokenKey);
                res.send(accessToken);
            }
        }
    });
});
exports.default = authRouter;
