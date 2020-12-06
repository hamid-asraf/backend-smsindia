const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const helmet = require('helmet');
const config = require('config');
const { logger } = require('./helper/logger');
const publicAPI      = require("./public/index.js");
const port = process.env.PORT || 3000 ;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,authorization,x-access-token, Content-Encoding');
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET');
      return res.status(200).json({});
    }
    next();
});


app.use("/api/", publicAPI);

app.get('/', function(req, res){
    res.status(200).send('Welcome to SMS India 😊!!');
});

app.get('*', function(req, res){
    logger.log({
        "level"   : "warn",
        "message" : `Access on ${req["headers"]["user-agent"]} `,
        "label"   : `Tried with wrong end point`
      })
    res.status(404).send('Not a valid end point!!');
});

app.listen(port, () => {
    logger.log({
        "level"   : "info",
        "message" : `This is ${config.get("environment")} environment, app listening at http://localhost:${port}`,
        "label"   : `Server Started at ${new Date()}`
    })
});

require("./database/index");
