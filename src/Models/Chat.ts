import { Schema, model } from "mongoose";

const chatSchema = new Schema(
    {
        members: [
            {
                type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
    }
);

const Chat = model(`chat`, chatSchema);

export default Chat;
