const express = require('express');
const app = express();

require('dotenv').config();

const bodyParser = require('./middleware/bodyParser');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

app.use(express.static('../client/public', { index: false }));
app.use(express.static('../client/src', { index: false }));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser);
app.use('/', routes);

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
