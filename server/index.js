const express = require('express');
const app = express();

app.use(express.json());

const db = require('./models');

const userRouter = require('./routes/users');
app.use("/user", userRouter);

app.listen(8000, () => {
    console.log("Server running on port 8000");   
});

