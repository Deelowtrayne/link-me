const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
const PORT = process.env.PORT || 4000;

// db config
const db = require('./config/keys').mongoURI;

// connect to mongodb
mongoose.connect(db)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err.stack))


// app.use(bodyParser.json());

app.get('/', (req, res) => res.send('INDEX PAGE'));

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// listen on server port
app.listen(PORT, () => console.log('App running on port', PORT));