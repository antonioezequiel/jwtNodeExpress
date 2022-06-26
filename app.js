const express = require('express');
const app = express();
//const {autentication} = require('./src/usuarios')
//const bodyParser = require('body-parser');

app.use(
  express.json()
);

module.exports = app;
