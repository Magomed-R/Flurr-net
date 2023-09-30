let { Schema, model, ObjectId } = require("mongoose");

const newSchema = new Schema(
    {
        author: {
            type: ObjectId,
            ref: "user"
        },
        content: String,
        likes: Number,
        comments: [
            {
                user: {
                    type: ObjectId,
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

module.exports = New;
