require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "mail.ru",
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});

const mailer = (to, subject, text) => {
    transporter.sendMail(
        {
            from: process.env.MAIL,
            to: to,
            subject: subject,
            text: text
        },
        (err, info) => {
            if (err) return console.log(err);

            console.log("Email sent: ", info);
        }
    );
};

module.exports = mailer;
