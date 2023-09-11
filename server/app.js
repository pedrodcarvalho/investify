const express = require('express');
const app = express();

require('dotenv').config();

const bodyParser = require('./middleware/bodyParser');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

app.set('view engine', 'ejs');
app.set('views', '../client/src/views');

const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('../client/public', { index: false }));
app.use(express.static('../client/src', { index: false }));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser);
app.use('/', routes);

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
