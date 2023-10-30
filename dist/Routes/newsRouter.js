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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let newsRouter = (0, express_1.Router)();
const New_1 = require("../Models/New");
const User_1 = require("../Models/User");
newsRouter
    .route("/")
    .get(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let news = yield New_1.New.find().sort({ createdAt: -1 }).populate({ path: "author", model: User_1.User });
        res.send(news);
    });
})
    .post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let news = new New_1.New({
            author: req.body.uid,
            content: req.body.content,
            likes: 0,
            comments: [],
        });
        news.save();
        res.sendStatus(200);
    });
})
    .delete(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let news = yield New_1.New.findOne({ _id: req.body.id }).populate("author");
        if (!news)
            res.sendStatus(404);
        if (req.body.uid != news.author._id)
            return res.sendStatus(403);
        yield New_1.New.deleteOne({ _id: req.body.id });
        return res.sendStatus(200);
    });
});
newsRouter.route("/:id").get(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let news = yield New_1.New.findOne({ _id: req.params.id })
            .populate({ path: "author", model: User_1.User })
            .populate({ path: "comments.user", model: User_1.User });
        res.send(news);
    });
});
exports.default = newsRouter;
