require('dotenv').config()

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        service: 'mail.ru',
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASSWORD
        }
    }
)

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) return console.log(err)

        console.log('Email sent: ', info)
    })
}

module.exports = mailer