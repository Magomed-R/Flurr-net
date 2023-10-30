import { Schema, model } from "mongoose";
import { IUser } from "./User";

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

export const Chat = model(`chat`, chatSchema);

export interface IChat {
    _id?: string,
    members: IUser[];
    messages: [
        {
            from: String;
            message: String;
            createdAt: Date;
        }
    ];
}
