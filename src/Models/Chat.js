let { Schema, model, ObjectId } = require("mongoose");

const chatSchema = new Schema(
    {
        members: [
            {
                type: ObjectId,
                ref: "user"
            }
        ],
        messages: [
            {
                from: String,
                message: String,
                createdAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
);

const Chat = model(`chat`, chatSchema);

module.exports = Chat;
