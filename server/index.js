const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()

app.use(express.json());
app.use(cors({
    origin: ['*', 'http://localhost:3001'],
}));

const userRouter = require('./routes/users');
app.use("/user", userRouter);


app.listen(8000, () => {
    console.log("Server running on port 8000");   
});

