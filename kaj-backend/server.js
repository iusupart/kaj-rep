require('dotenv').config();

/**
 * Import required dependencies
 */
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const PublicRoutes = require('./settings/PublicRoutes');
const PrivateRoutes = require('./settings/PrivateRoutes');

/**
 * Set the port for the server
 */
const port = 3000;

/**
 * Establish a database connection
 */
const connection = require('./settings/db');

/**
 * Create an instance of the Express application
 */
const app = express();
app.use(cors());

/**
 * Create an HTTP server using the Express application
 */
const server = http.createServer(app);

/**
 * Create a new instance of Socket.IO server and configure it
 */
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});

/**
 * Parse incoming requests with JSON payloads
 */
app.use(bodyParser.json());

/**
 * Initialize public routes
 */
const publicRoutes = new PublicRoutes(io);
publicRoutes.start();

/**
 * Initialize private routes
 */
const privateRoutes = new PrivateRoutes(io);
privateRoutes.start();

/**
 * Start the server and listen for incoming connections on the specified port
 */
server.listen(port, () => {
  console.log("Listening started on port " + port);
});