var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/router');
var corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE']
};

var app = express();

app.use (morgan('dev'));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', routes);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port 3000...');