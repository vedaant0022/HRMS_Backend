const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HRMS API',
      version: '1.0.0',
      description: 'API documentation for HRMS application',
      contact: {
        name: 'Vedaant Sankhe',
        email: 'vedaant.sankhe@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./routes/*.js'], 

};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
