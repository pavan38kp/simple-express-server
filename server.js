require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const app = express();

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const oAuth2Client = new google.auth.OAuth2(
    process.env.CI,
    process.env.CS,
);
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});


app.post('/mail', async function(req, res) {
    const {to, body, subject} = req.body;
    if(!to || !body || !subject) return res.status(400).json({
        status: 'error',
        message: 'invalid req body'
    });

    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "educity@nonceblox.com",
            clientId: process.env.CI,
            clientSecret: process.env.CS,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });


    const data = await transporter.sendMail({
        from: 'educity@nonceblox.com',
        to,
        subject,
        html: body,
    }).catch(console.log)

    return res.status(200).json({
        ...data,
        status: 'done'
    });
});

app.listen(process.env.PORT, () => {
    console.log('ihadi')
});
