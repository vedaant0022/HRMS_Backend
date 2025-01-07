
const express =require('express')
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors');
const Add = require('./Models/Add');

const dburl = process.env.MONGOURL;
mongoose.connect(dburl)
const app = express()
const port = 8000;
app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
    res.end("Server started")
})




  
app.listen(port,()=>{
    console.log("Working ", port)
})

