
const express =require('express')
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors');


const dburl = process.env.MONGOURL;
mongoose.connect(dburl)
const app = express()
const port = 8000;
app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
    res.end("Welcome to HRMS Management System")
})




  
app.listen(port,()=>{
    console.log("Working ", port)
})

