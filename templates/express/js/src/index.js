{{ importSection }}

const express = require('express');
const router = require('./routes');

const app = express();

{{ useSection }}

app.use(express.urlencoded({ extended: false }));
router(app);

module.exports = app;
