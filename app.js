const express = require('express');
const cors = require('cors');
const logger = require('morgan');

// ENV loader
const dotenv = require('dotenv');
dotenv.config();

// MIDDLEWARES
const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

// ROUTES
const routes = require('./routes');

// INITIATE APP
const app = express();

// CORS
app.use(
  cors({
    origin: '*',
    exposedHeaders: ['Content-Disposition'],
  }),
);

// LOGGING
app.use(logger('combined'));

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MIDDLEWARES
app.use(authMiddleware);

// ROUTE HANDLERS
app.use('/v1', routes.v1);

// ERROR MIDDLEWARE (SHOULD BE THE LAST HANDLER)
app.use(errorMiddleware);

module.exports = app;
