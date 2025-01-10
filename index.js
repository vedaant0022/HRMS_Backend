
const express =require('express')
require('dotenv').config()
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/Swagger');
const connectDB = require('./config/DB.config');
const userRoutes = require('./routes/userRoutes.js')
const app = express()
const port = process.env.PORT;
app.use(express.json())
app.use(cors())
connectDB();



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/users', userRoutes);

app.get('/',(req,res)=>{
    res.end("Welcome to HRMS Management System")
})


app.listen(port,()=>{
    console.log("Working ", port) 
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
})

