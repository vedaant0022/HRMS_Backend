
const express =require('express')
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/Swagger');


const dburl = process.env.MONGOURL;
mongoose.connect(dburl)
const app = express()
const port = 8000;
app.use(express.json())
app.use(cors())



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/',(req,res)=>{
    res.end("Welcome to HRMS Management System")
})


app.listen(port,()=>{
    console.log("Working ", port)
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
})

