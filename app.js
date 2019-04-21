const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const http = require('http');



if (dotenv.error) {
    throw dotenv.error
}


const indexRouter = require('./routes/index');
const mapsRouter = require('./routes/maps');

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "air",
    port: 8889
});

db.connect( (err) => {
    if(err) throw err;
    console.log('Connected to database')
});
global.db = db;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/maps/', mapsRouter);
app.use('/', indexRouter);

app.listen(3000, () => console.log("Server running on port 8080"));

module.exports = app;
