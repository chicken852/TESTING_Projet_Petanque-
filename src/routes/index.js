const express = require('express');
const path = require('path');
const pool = require('../db'); // Import the database connection
const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

// Route d'accueil
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));  // Serve home.html
});

// Route pour la page des membres
router.get('/membres', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'membres.html'));  // Serve membres.html
});

// Route pour la page des challenges
router.get('/challenges', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'challenges.html'));  // Serve challenges.html
});

// Route pour la page de création de challenge
router.get('/challenges/creation', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'creation-challenges.html'));  // Serve creer-challenge.html
});



// ROUTES AVEC LA BASE DE DONNÉES

// Route pour récupérer les membres de la base de données
router.get('/api/members', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM members');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route pour ajouter un membre
router.post('/api/members', async (req, res) => {
    let { firstname, lastname, gender, age, birthdate, rank } = req.body;
    try {
        if (gender === "Homme") {
            gender = 'M';
        } else if (gender === "Femme") {
            gender = 'F';
        } else {
            gender = 'K';
        }
        const result = await pool.query(
            'INSERT INTO members (firstname, lastname, gender, age, birthday, rank) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [firstname, lastname, gender, age, birthdate, rank]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route pour rechercher un membre par ID
router.get('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Player not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route pour supprimer un membre
router.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Member not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;