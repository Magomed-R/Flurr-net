import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
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
                type: Schema.Types.ObjectId,
                ref: "user"
            }
        ],
        chats: [
            {
                type: Schema.Types.ObjectId,
                ref: "chat"
            }
        ]
    },
    {
        timestamps: true
    }
);

const User = model(`user`, userSchema);

export default User;
