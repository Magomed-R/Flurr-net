import { Request, Response, Router } from "express";
let newsRouter = Router();

import Chat from "../Models/Chat";
import New from "../Models/New";
import User from "../Models/User";

newsRouter
    .route("/")
    .get(async function (req, res) {
        let news = await New.find().sort({ createdAt: -1 }).populate({ path: "author", model: User });

        res.send(news);
    })
    .post(async function (req, res) {});

newsRouter.route("/:id").get(async function (req, res) {
    let news = await New.findOne({ _id: req.params.id }).populate({ path: "author", model: User }).populate({ path: "comments.user", model: User });
    res.send(news);
});

export default newsRouter;
