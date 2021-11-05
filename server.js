const express = require('express');
const app = express();
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res, next) => {
    res.send('Hello world!');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));