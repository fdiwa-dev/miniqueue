require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupRoutes } = require('../src/routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname + '/..'));
setupRoutes(app);

// Pour Vercel serverless
module.exports = app;
