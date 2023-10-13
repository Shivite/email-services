const express = require('express');
require('dotenv').config();
const config = require("config");
const app = express();

const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const corsConfig = require('./handlers/cors-config');
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(corsConfig);

const transporter = nodemailer.createTransport({
    host: config.get("mailhog.host"),
    port: config.get("mailhog.smtp_port")
});

app.get('/', (req, res) => res.send('Home Page'));



app.post('/api/send_mail', async (req, res) => {
    let { text } = req.body;

    const obj = transporter.sendMail({
        from: "My company <localhost@mailhog.local>",
        to: "test@gmailer.com",
        subject: "test",
        text: "test text"
    });

    if (!obj) {
        res.status(500).json({
            status: "internal server error",
            message: "error sending message"
        });
    }

    res.status(201).json({
        status: "create",
        message: "message sent"
    });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));