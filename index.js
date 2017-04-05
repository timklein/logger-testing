'use strict';

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

const app = express();
const logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
if (!fs.existsSync(logDirectory)) {fs.mkdirSync(logDirectory);}

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

app.use(morgan(':remote-addr [:date[clf]] ":method :url" status :status :res[content-length] bytes :response-time[2] ms', {stream: accessLogStream}));
app.use(morgan(':remote-addr [:date[clf]] ":method :url" status :status :res[content-length] bytes :response-time[2] ms'));

app.get('/', function (req, res) {
	console.log('This is a test');
	res.send('Hello World!');
});

const port = 3000;
const server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});