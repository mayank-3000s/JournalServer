const mongoose = require('mongoose');
require("dotenv").config();

//const mongoURL = `mongodb+srv://mayankkne11_db_user:${process.env.DB_PASSWORD}@journaldb.m8nccig.mongodb.net/`
const mongoURL = `mongodb+srv://mayankkne11_db_user:${process.env.DB_PASSWORD}@journaldb.m8nccig.mongodb.net/`

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log('Connected to MongoDB');
})


db.on('disconnected', ()=>{
    console.log('Disconnected from MongoDB');
})
db.on('error', (err)=>{
    console.log(`Error connecting to MongoDB: ${err}`);
})

module.exports = db;