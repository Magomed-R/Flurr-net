import { Request, Response, Router } from "express";
let newsRouter = Router();

import { New, INew } from "../Models/New";
import { User, IUser } from "../Models/User";

newsRouter
    .route("/")
    .get(async function (req, res) {
        let news = await New.find().sort({ createdAt: -1 }).populate({ path: "author", model: User });

        res.send(news);
    })
    .post(async function (req, res) {
        let news = new New({
            author: req.body.uid,
            content: req.body.content,
            likes: 0,
            comments: [],
        });

        news.save();
        res.sendStatus(200);
    })
    .delete(async function (req, res) {
        let news: INew | null = await New.findOne({ _id: req.body.id }).populate("author");

        if (!news) res.sendStatus(404);
        if (req.body.uid != news!.author._id) return res.sendStatus(403);

        await New.deleteOne({ _id: req.body.id });
        return res.sendStatus(200);
    });

newsRouter.route("/:id").get(async function (req, res) {
    let news = await New.findOne({ _id: req.params.id })
        .populate({ path: "author", model: User })
        .populate({ path: "comments.user", model: User });
    res.send(news);
});

export default newsRouter;
