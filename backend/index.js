require(`dotenv`).config();

let dayjs = require("dayjs");

const express = require(`express`);
const app = express();
const port = process.env.PORT || 3010;

const bcrypt = require(`bcryptjs`);
const jwt = require("jsonwebtoken");
const mongoose = require(`mongoose`);
let cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));
app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

const chalk = require("chalk");

try {
    app.listen(port, () => console.log(chalk.bgGreen(`server started on port ${port}`)));
    mongoose
        .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.dvfjqpc.mongodb.net/flurr`)
        .then((res) => console.log(chalk.bgGreen("Connected to DB")))
        .catch((error) => console.log(error));
} catch (error) {
    console.log(error);
}

let Chat = require("./Models/Chat");

let User = require("./Models/User");

let New = require("./Models/New");

let mailer = require("./nodemailer");

app.post(`/auth`, authenticateCheck, (req, res) => {
    res.sendStatus(200);
});

app.post(`/login`, authCheck, async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        let user = await User.findOne({ username: username });
        if (!user) {
            res.sendStatus(401);
        } else if (!(await bcrypt.compare(password, user.password))) {
            res.sendStatus(403);
        } else {
            let data = { id: user._id };
            const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);

            res.send({ accessToken: accessToken });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(410);
    }
});

app.post(`/signup`, authCheck, async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        if (password.length < 4) {
            return res.sendStatus(403);
        }
        const hashedPassword = await bcrypt.hash(password, 7);

        let user = await User.findOne({ username: username });

        if (!user) {
            user = new User({
                username: username,
                password: hashedPassword,
                aboutme: ``,
                avatar: ``,
                gender: ``,
                admin: false,
                birthday: null,
                likedNews: [],
                friends: [],
                chats: []
            });

            await user.save();

            user = await User.findOne({ username: username });

            let data = { id: user._id };
            const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);

            res.send({ accessToken: accessToken });
        } else {
            res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);

        res.sendStatus(410);
    }
});

app.get(`/find/me`, authenticateCheck, async function (req, res) {
    id = req.user.id;

    try {
        let user = await User.findOne({ _id: id });

        if (!user) {
            res.sendStatus(404);
        } else {
            res.send(user);
        }
    } catch (error) {
        console.log(error);

        res.sendStatus(410);
    }
});

app.get(`/find/user`, authenticateCheck, async function (req, res) {
    let id = req.query.id;

    try {
        let user = await User.findOne({ _id: id });

        if (!user) {
            res.sendStatus(404);
        } else {
            res.send(user);
        }
    } catch (error) {
        console.log(error);

        res.sendStatus(410);
    }
});

app.get(`/find/user/length`, authCheck, function (req, res) {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(410);
        });
});

app.get(`/news/all`, authenticateCheck, async function (req, res) {
    try {
        let news = await New.find().sort({ createdAt: -1 }).populate("author");

        res.send(news);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

app.get(`/news/one`, authenticateCheck, async function (req, res) {
    let id = req.query.id;

    try {
        let news = await New.findOne({ _id: id }).populate("author").populate("comments.user");
        res.send(news);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

app.post(`/news/newComment`, authenticateCheck, async function (req, res) {
    let userId = req.body.userId;
    let newsId = req.body.newsId;
    let text = req.body.text;

    try {
        let user = await User.findOne({ _id: userId });
        let news = await New.findOne({ _id: newsId });

        if (!user || !news || !text) {
            res.sendStatus(403);
        } else {
            news.comments.push({
                user: user._id,
                text: text,
                createdAt: dayjs().format()
            });

            news.save();

            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(410);
    }
});

app.post(`/news/likeNews`, authenticateCheck, async function (req, res) {
    let newsId = req.body.newsId;
    let userId = req.user.id;

    try {
        let news = await New.findOne({ _id: newsId });
        let user = await User.findOne({ _id: userId });

        if (!user.likedNews.includes(news._id)) {
            news.likes++;
            user.likedNews.push(newsId);

            await news.save();
            await user.save();

            res.send(`like`);
        } else {
            news.likes--;
            let i = user.likedNews.indexOf(newsId);
            user.likedNews.splice(i, 1);

            await news.save();
            await user.save();

            res.send(`unlike`);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

app.post(`/addFriend`, authenticateCheck, async function (req, res) {
    let userId = req.user.id;
    let userFriendId = req.body.userFriendId;

    try {
        let user = await User.findOne({ _id: userId });
        let userFriend = await User.findOne({ _id: userFriendId });

        user.friends.push(userFriendId);
        userFriend.friends.push(userId);

        let chat = new Chat({
            members: [userId, userFriendId],
            messages: []
        });

        user.chats.push(chat._id);
        userFriend.chats.push(chat._id);

        await user.save();
        await userFriend.save();
        await chat.save();

        res.sendStatus(200);
    } catch (error) {
        console.log(error);

        res.sendStatus(404);
    }
});

app.get(`/dialog/all`, authenticateCheck, async function (req, res) {
    try {
        let userId = req.user.id;
        let user = await User.findOne({ _id: userId }).populate("chats");
        await user.populate("chats.members");

        res.send(user);
    } catch (error) {
        console.log(error);
        res.send(400);
    }
});

app.post(`/dialog/newMessage`, authenticateCheck, async function (req, res) {
    let chatId = req.body.chatId;
    let userId = req.user.id;
    let message = req.body.message;

    try {
        if (!chatId || !userId || !message) {
            res.sendStatus(403);
        } else {
            let chat = await Chat.findOne({ _id: chatId });
            let user = await User.findOne({ _id: userId });

            chat.messages.push({
                from: user.username,
                message: message,
                createdAt: dayjs().format()
            });

            let memberId = chat.members.find((member) => {
                member != userId;
            });

            let member = await User.find({ _id: memberId });

            if (member.email) {
                mailer(member.email, user.username, message);
            }

            chat.save();

            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get(`/friends/my`, authenticateCheck, async function (req, res) {
    let id = req.user.id;

    try {
        let user = await User.findOne({ _id: id }).populate("friends");

        if (!user) {
            res.sendStatus(404);
        } else {
            res.send(user);
        }
    } catch (error) {
        console.log(error);

        res.sendStatus(410);
    }
});

app.get(`/friends/possible`, authenticateCheck, async function (req, res) {
    let id = req.user.id;

    try {
        let user = await User.findOne({ _id: id });
        let posFriends = await User.find({ $and: [{ _id: { $nin: user.friends } }, { _id: { $ne: id } }] });

        if (!user) {
            res.sendStatus(404);
        } else {
            res.send(posFriends);
        }
    } catch (error) {
        console.log(error);

        res.sendStatus(418);
    }
});

app.post(`/deleteFriend`, authenticateCheck, async function (req, res) {
    let userId = req.user.id;
    let userFriendId = req.body.userFriendId;

    try {
        if (!userId || !userFriendId) {
            res.sendStatus(403);
        } else {
            let user = await User.findOne({ _id: userId });
            let userFriend = await User.findOne({ _id: userFriendId });
            let chat = await Chat.deleteOne({ members: { $all: [userId, userFriendId] } });

            let uI = user.friends.indexOf(userFriend._id);
            let uFI = userFriend.friends.indexOf(user._id);

            user.friends.splice(uI, 1);
            userFriend.friends.splice(uFI, 1);

            if (chat) {
                await user.save();
                await userFriend.save();

                res.sendStatus(200);
            } else {
                404;
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(410);
    }
});

app.post(`/settings/new`, authenticateCheck, async function (req, res) {
    let account = req.body.user;

    if (!account.username) {
        res.sendStatus(403);
    } else {
        try {
            let user = await User.findOne({ _id: account._id });

            if (!user) {
                res.sendStatus(404);
            } else {
                user.username = account.username;
                user.avatar = account.avatar;
                user.birthday = account.birthday;
                user.email = account.email;
                user.gender = account.gender;
                user.aboutme = account.aboutme;

                await user.save();

                res.sendStatus(200);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(400);
        }
    }
});

function authenticateCheck(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
        if (error) {
            console.log(error);
            return res.sendStatus(403);
        }

        let account = await User.findOne({ _id: user.id });
        if (!account) return res.sendStatus(401);
        req.user = user;
        next();
    });
}

function authCheck(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return next();

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
        if (error) return next();

        let account = await User.findOne({ _id: user.id });
        if (!account) return next();
        res.sendStatus(200);
    });
}
