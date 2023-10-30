import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import {User} from "../Models/User";

interface IUser extends JwtPayload {
    id?: string;
}

let accessTokenKey = process.env.ACCESS_TOKEN_SECRET || "";

export async function authCheck(req: Request, res: Response, next: NextFunction) {
    if (req.path == "/auth/login" || req.path == "/auth/signup") return next()
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    let user: IUser | string = jwt.verify(token, accessTokenKey);

    if (typeof user != "string") {
        let account = await User.findOne({ _id: user.id });
        if (!account) return res.sendStatus(401);
        
        if (!req.body) req.body = {}
        req.body.uid = user.id;
        next();
    }
}