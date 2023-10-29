import { Schema, model } from "mongoose";

const newSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0,
            min: 0
        },
        comments: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "user"
                },
                text: {
                    type: String,
                    required: true
                },
                createdAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
);

const New = model(`new`, newSchema);

export default New;
