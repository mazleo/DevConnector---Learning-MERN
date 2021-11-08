const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db')
connectDB();

app.use(express.json({extended: false}));

const userRouter = require('./routes/api/users');
app.use('/api/users', userRouter);
const authRouter = require('./routes/api/auth');
app.use('/api/auth', authRouter);

app.get('/', (req, res, next) => {
    res.send('Hello world!');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));