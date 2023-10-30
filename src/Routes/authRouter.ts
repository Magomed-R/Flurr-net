import dotenv from "dotenv";
dotenv.config();

let accessTokenKey = process.env.ACCESS_TOKEN_SECRET || "";

import { Request, Response, Router } from "express";
let authRouter = Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User, IUser } from "../Models/User";

authRouter.route("/").get(function (req, res) {
    res.sendStatus(200);
});

authRouter.route("/login").post(async function (req: Request, res: Response) {
    let { username, password } = req.body;

    let user = await User.findOne({ username: username });

    if (!user) res.sendStatus(401);
    else if (!(await bcrypt.compare(password, user.password))) res.sendStatus(403);
    else {
        let data = jwt.sign({ id: user._id }, accessTokenKey);
        res.send(data);
    }
});

authRouter.route("/signup").post(async function (req: Request, res: Response) {
    let { username, password, email } = req.body;

    if (password.length < 4) return res.sendStatus(403);
    if (!username || !email || !password) return res.sendStatus(405);

    const hashedPassword = await bcrypt.hash(password, 7);

    let user: IUser | null = await User.findOne({ username: username });

    if (!user) {
        let NewUser = new User({
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

        await NewUser.save();

        user = await User.findOne({ username: username });

        if (user) {
            let data = { id: user._id };
            const accessToken = jwt.sign(data, accessTokenKey);
            res.send(accessToken);
        }
    }
});

export default authRouter;
