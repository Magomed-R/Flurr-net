"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    aboutme: String,
    email: String,
    avatar: String,
    gender: String,
    admin: Boolean,
    birthday: {
        type: Date
    },
    likedNews: [String],
    friends: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    chats: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "chat"
        }
    ]
}, {
    timestamps: true
});
const User = (0, mongoose_1.model)(`user`, userSchema);
exports.default = User;
