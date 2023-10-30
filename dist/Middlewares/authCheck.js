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
exports.authCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../Models/User");
let accessTokenKey = process.env.ACCESS_TOKEN_SECRET || "";
function authCheck(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (req.path == "/auth/login" || req.path == "/auth/signup")
            return next();
        const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.sendStatus(401);
        let user = jsonwebtoken_1.default.verify(token, accessTokenKey);
        if (typeof user != "string") {
            let account = yield User_1.User.findOne({ _id: user.id });
            if (!account)
                return res.sendStatus(401);
            if (!req.body)
                req.body = {};
            req.body.uid = user.id;
            next();
        }
    });
}
exports.authCheck = authCheck;
