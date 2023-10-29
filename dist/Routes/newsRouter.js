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
const express_1 = require("express");
let newsRouter = (0, express_1.Router)();
const New_1 = __importDefault(require("../Models/New"));
const User_1 = __importDefault(require("../Models/User"));
newsRouter
    .route("/")
    .get(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let news = yield New_1.default.find().sort({ createdAt: -1 }).populate({ path: "author", model: User_1.default });
        res.send(news);
    });
})
    .post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
});
newsRouter.route("/:id").get(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let news = yield New_1.default.findOne({ _id: req.params.id }).populate({ path: "author", model: User_1.default }).populate({ path: "comments.user", model: User_1.default });
        res.send(news);
    });
});
exports.default = newsRouter;
