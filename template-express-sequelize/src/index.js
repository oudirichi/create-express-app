const express = require('express');
const router = require('./routes');
const app = express();
const helmet = require('helmet');

app.use(express.json());

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
router(app);

module.exports = app;
