const express = require('express');
const app = express();
app.use(express.json());
const db = require('./db');
const router = require('./router/userRouter');
const router2 = require('./router/summaryRouter');
require("dotenv").config();
const cors = require('cors');

app.use(cors());
app.get('/', (req, res)=>{
    res.send('Hello user');
})

app.use('/user', router);
app.use('/summary', router2);

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`Server is live on port ${port}`);
})