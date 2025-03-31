
const express =require('express')
require('dotenv').config()
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/Swagger');
const connectDB = require('./config/DB.config');
const userRoutes = require('./routes/userRoutes.js')
const leaveRoutes = require('./routes/leaveRoutes.js')
const ReimbursementRoutes = require('./routes/ReimbursementRoutes.js')
const attendanceRoutes = require('./routes/attendanceRoutes.js')
const RegularizationRoutes = require('./routes/RegularizationRoutes.js')
const app = express()
const port = process.env.PORT;

app.use(express.json())
app.use(cors())
connectDB();



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/users', userRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/reimbursement', ReimbursementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/attendance-regularization', RegularizationRoutes);

app.get('/', (req, res) => {
    const port = process.env.PORT || 3000; // Ensure the port is defined if not already set
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HRMS Management System</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #111;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    overflow: hidden;
                    text-align: center;
                    flex-direction: column;
                    padding: 20px;
                }
                h1 {
                    font-size: 4em;
                    letter-spacing: 2px;
                    color: #fff;
                    animation: fadeIn 2s ease-out;
                    text-shadow: 0 0 5px #1ABC9C, 0 0 10px #1ABC9C, 0 0 15px #1ABC9C;
                    animation: glowing 1.5s infinite alternate;
                }
                p {
                    font-size: 1.5em;
                    margin: 20px 0;
                    color: #bdc3c7;
                    animation: fadeIn 2s ease-out;
                    animation-delay: 0.5s;
                }
                .highlight {
                    color: #fff;
                    font-weight: bold;
                    font-size: 1.2em;
                    text-shadow: 0 0 5px #e74c3c, 0 0 10px #e74c3c;
                }
                .glowing-text {
                    color: #fff;
                    font-weight: bold;
                    text-shadow: 0 0 5px #e74c3c, 0 0 10px #e74c3c, 0 0 15px #e74c3c;
                    animation: glowing 1.5s infinite alternate;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 1.2em;
                    color: #95a5a6;
                    animation: fadeIn 2s ease-out;
                    animation-delay: 1s;
                }
                .footer a {
                    color: #3498db;
                    text-decoration: none;
                    font-weight: bold;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
                /* Keyframes for animations */
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                @keyframes glowing {
                    0% {
                        text-shadow: 0 0 5px #e74c3c, 0 0 10px #e74c3c, 0 0 15px #e74c3c, 0 0 20px #e74c3c;
                    }
                    50% {
                        text-shadow: 0 0 10px #e74c3c, 0 0 20px #e74c3c, 0 0 30px #e74c3c, 0 0 40px #e74c3c;
                    }
                    100% {
                        text-shadow: 0 0 5px #e74c3c, 0 0 10px #e74c3c, 0 0 15px #e74c3c, 0 0 20px #e74c3c;
                    }
                }
            </style>
        </head>
        <body>
            <h1>Welcome to HRMS Management System</h1>
            <p>Your server is live on port: <span class="highlight">${port}</span></p>
            <p class="glowing-text">Server is up and running smoothly!</p>
            <div class="footer">
                <p>Developed by <a href="https://github.com/vedaant0022" target="_blank">Vedaant Sankhe</a></p>
            </div>
        </body>
        </html>
    `);
});


app.listen(port,()=>{
    console.log("Working ", port) 
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
    console.log(`Server Live at http://localhost:${port}/`);
})

