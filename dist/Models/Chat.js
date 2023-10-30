"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    messages: [
        {
            from: String,
            message: String,
            createdAt: Date,
        },
    ],
}, {
    timestamps: true,
});
exports.Chat = (0, mongoose_1.model)(`chat`, chatSchema);
