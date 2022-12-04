const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()

app.use(express.json());
app.use(cors({
    origin: ['*', 'http://localhost:3001'],
}));

const userRouter = require('./routes/users');
const candidateRouter = require('./routes/candidates');
const companyRouter = require('./routes/companies');
const jobRouter = require('./routes/jobs');
const permissionRouter = require('./routes/permissions');

app.use("/user", userRouter);
app.use("/candidates", candidateRouter);
app.use("/companies", require("./routes/companies"));
app.use("/jobs", jobRouter);
app.use("/permissions", permissionRouter);

app.use('/uploads', express.static(__dirname + '/uploads'));

app.listen(8000, () => {
    console.log("Server running on port 8000");   
});

