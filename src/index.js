const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes'); // Import the routes

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Use the routes defined in routes/index.js
app.use('/', routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
