import { Schema, model } from "mongoose";
import { IUser } from "./User";

const newSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
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
                    type: Schema.Types.ObjectId,
                    ref: "user",
                },
                text: {
                    type: String,
                    required: true,
                },
                createdAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const New = model(`new`, newSchema);

export interface INew {
    _id: string,
    author: IUser,
    content: string,
    likes: number,
    comments: [
        {
            user: IUser;
            text: string;
            createdAt: Date;
        }
    ]
}
