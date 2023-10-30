"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
const mongoose_1 = require("mongoose");
const newSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
        min: 0,
    },
    comments: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "user",
            },
            text: {
                type: String,
                required: true,
            },
            createdAt: Date,
        },
    ],
}, {
    timestamps: true,
});
exports.New = (0, mongoose_1.model)(`new`, newSchema);
