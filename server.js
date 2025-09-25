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

app.listen(3000, ()=>{
    console.log('Server running on port 3000');
})