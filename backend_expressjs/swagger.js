const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do App API',
      version: '1.0.0',
      description: 'Express.js REST API for a MySQL-backed to-do list application.',
    }
  },
  apis: ['./src/routes/*.js'], // includes index.js and tasks.js
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
