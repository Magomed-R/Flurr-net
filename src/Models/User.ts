import { Schema, model } from "mongoose";
import { IChat } from "./Chat";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        aboutme: String,
        email: String,
        avatar: String,
        gender: String,
        admin: Boolean,
        birthday: {
            type: Date,
        },
        likedNews: [String],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        chats: [
            {
                type: Schema.Types.ObjectId,
                ref: "chat",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const User = model(`user`, userSchema);

export interface IUser {
    _id?: string,
    username: string,
    password: string,
    aboutme?: string,
    email: string,
    avatar?: string,
    gender?: string,
    admin?: boolean,
    birthday?: Date,
    likedNews?: [string],
    friends?: IUser[],
    chats?: IChat[],
}
