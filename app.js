'use strict';

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const winston = require('winston');
const split = require('split');
const path = require('path');
const rfs = require('rotating-file-stream');

const app = express();
const logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
if (!fs.existsSync(logDirectory)) {fs.mkdirSync(logDirectory);}

const tsFormat = () => (new Date()).toTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      // timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDirectory}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: 'verbose'
    })
  ]
});

logger.stream = split().on('data', function (message) {
  logger.info(message);
});

app.use(morgan(":remote-addr [:date[clf]] ':method :url' status :status :res[content-length] bytes :response-time[2] ms", {stream: logger.stream}));

app.get('/', function (req, res) {
	logger.error('Test');
	res.send('Hello World!');
});

const port = 3000;
const server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});