require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const PublicRoutes = require('./settings/PublicRoutes');
const PrivateRoutes = require('./settings/PrivateRoutes');
const port = 3000;
const connection = require('./settings/db');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true
    }
});

app.use(bodyParser.json());

const publicRoutes = new PublicRoutes(io);
publicRoutes.start();

const privateRoutes = new PrivateRoutes(io);
privateRoutes.start();

server.listen(port, () => {
    console.log("Listening started on port " + port)
});
