const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Servir les fichiers statiques du dossier "public"
app.use(express.static('public'));

// Importer les routes
const routes = require('./routes');  // Cela fait référence à src/routes/index.js
app.use('/', routes);  // Utilise les routes définies dans routes/index.js

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

