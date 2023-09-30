let { Schema, model, ObjectId } = require("mongoose");

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
                type: ObjectId,
                ref: "user"
            }
        ],
        chats: [
            {
                type: ObjectId,
                ref: "chat"
            }
        ]
    },
    {
        timestamps: true
    }
);

const User = model(`user`, userSchema);

module.exports = User;
