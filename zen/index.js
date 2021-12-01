const winston = require('winston');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

require('./startup/db')();

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: false }), bodyParser.text());
app.use(cors());

app.use('/', (req, res, next) => {
    // console.log(req);
    next();
});

require('./startup/routes')(app);
process.on('unhandledRejection', (ex) => {
    throw ex;
});

if (app.get('env') !== 'production') {
}

const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Listening on port ${ port }...`));
