const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('INDEX PAGE'));

// listen on server port
app.listen(PORT, () => console.log('App running on port', PORT));