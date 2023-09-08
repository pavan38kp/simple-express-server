require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
var app = express();

const ses = new AWS.SES({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    apiVersion: '2010-12-01'
})


//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", async (_, res) => {
    
    const params = {
        Destination: { 
          ToAddresses: [
            'kppavu@gmail.com'
          ]
        },
        Source: process.env.AWS_SES_SOURCE,
        Message: { 
          Body: { 
            Text: {
              Charset: "UTF-8",
              Data: 'body'
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'subject'
          }
        },
      };

    const data = await ses.sendEmail(params).promise();
    res.status(200).json({
        ...data,
        status: 'done'
    });
})

app.post('/mail', async function(req, res) {
    const {to, body, subject} = req.body;
    const params = {
        Destination: { 
          ToAddresses: [
            to
          ]
        },
        Source: process.env.AWS_SES_SOURCE,
        Message: { 
          Body: { 
            Text: {
              Charset: "UTF-8",
              Data: body
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject
          }
        },
      };

    const data = await ses.sendEmail(params).promise();
    res.status(200).json({
        ...data,
        status: 'done'
    });
});

app.listen(6069, () => {
    console.log('ihadi')
});
