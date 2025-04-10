const express = require('express');
const path = require('path');
const pool = require('../db/db'); // Import the database connection
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

router.get('/terrains', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'terrains.html'));  // Serve terrains.html
});

// ROUTES AVEC LA BASE DE DONNÉES

// Route pour récupérer les membres de la base de données
router.get('/api/members', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM membres');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route pour ajouter un membre
router.post('/api/members', async (req, res) => {
    let { firstname, lastname, gender, birthdate} = req.body;
    let rank;
    let age = calculerAge(birthdate);
    try {
        if (gender === 'homme' || gender === 'Homme') {
            gender = 'H';
        } else if (gender === 'femme' || gender === 'Femme') {
            gender = 'F';
        } else {
            gender = 'K';
        }

        if (gender === "F")
        {
            rank = 'Femme';
        } 
        else if (Number(age) < 18)
        {
            rank = 'Junior';
        }
        else if (Number(age) >= 18 && Number(age) <= 50 && gender === "H")
        {
            rank = 'Sénior';
        } else
        {
            rank = 'Vétéran';
        }



        const result = await pool.query(
            'INSERT INTO membres (prenom, nom, genre, age, date_naissance, rang) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
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
        const result = await pool.query('SELECT * FROM membres WHERE id = $1', [id]);
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
        const result = await pool.query('DELETE FROM membres WHERE id = $1 RETURNING *', [id]);
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

// Route pour mettre à jour un membre
router.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    let { firstname, lastname, gender, birthdate } = req.body;
    let rank;
    let age = calculerAge(birthdate);
    try {
        if (gender === 'homme' || gender === 'Homme') {
            gender = 'H';
        } else if (gender === 'femme' || gender === 'Femme') {
            gender = 'F';
        } else {
            gender = 'K';
        }

        if (gender === "F") {
            rank = 'Femme';
        } else if (Number(age) < 18) {
            rank = 'Junior';
        } else if (Number(age) >= 18 && Number(age) <= 50 && gender === "H") {
            rank = 'Sénior';
        } else {
            rank = 'Vétéran';
        }

        const result = await pool.query(
            'UPDATE membres SET prenom = $1, nom = $2, genre = $3, age = $4, date_naissance = $5, rang = $6 WHERE id = $7 RETURNING *',
            [firstname, lastname, gender, age, birthdate, rank, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Member not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get last teams from database
router.get('/api/teams/count', async (req, res) => {
    try {
      const result = await pool.query('SELECT COUNT(*) FROM Equipes');
      const count = parseInt(result.rows[0].count, 10);
      res.json({ count });
    } catch (error) {
      console.error('Error fetching team count:', error);
      res.status(500).json({ error: 'Error fetching team count' });
    }
  });

// Store new teams in database
router.post('/api/teams', async (req, res) => {
    const client = await pool.connect();
    try {
      const { teams } = req.body;
  
      await client.query('BEGIN');
  
      for (const team of teams) {
        // Determine team type based on number of members
        const type = team.length === 3 ? 'T' : 'D';
  
        // Insert into Equipes
        const equipeResult = await client.query(
          `INSERT INTO Equipes (type) VALUES ($1) RETURNING id`,
          [type]
        );
        const equipeId = equipeResult.rows[0].id;
  
        // Extract member IDs
        const membre1 = team[0]?.id || null;
        const membre2 = team[1]?.id || null;
        const membre3 = team[2]?.id || null;
  
        // Insert into Membres_Equipes
        await client.query(
          `INSERT INTO Membres_Equipes (equipe_id, membre1, membre2, membre3)
           VALUES ($1, $2, $3, $4)`,
          [equipeId, membre1, membre2, membre3]
        );
      }
  
      await client.query('COMMIT');
      res.status(201).json({ message: 'Teams saved successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error saving teams:', err);
      res.status(500).json({ error: 'Failed to save teams' });
    } finally {
      client.release();
    }
  });

  // Get all terrains from database
  router.get('/api/terrains/disponibles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM terrains WHERE disponible = TRUE ORDER BY id');
        res.json({ terrains: result.rows });
    } catch (error) {
        console.error('Error fetching available terrains:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des terrains disponibles.' });
    }
});

// Toggle terrain availability
router.put('/api/terrains/:id', async (req, res) => {
    const { id } = req.params;
    const { disponible } = req.body;
  
    try {
      await pool.query('UPDATE terrains SET disponible = $1 WHERE id = $2', [disponible, id]);
      res.json({ message: 'Terrain mis à jour avec succès.' });
    } catch (error) {
      console.error('Error updating terrain:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du terrain.' });
    }
  });

  // Get all terrains from database
  router.get('/api/terrains', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM terrains ORDER BY id');
        res.json({ terrains: result.rows });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Erreur lors de la récupération des terrains.' });
    }
});

// FONCTIONS

function calculerAge(dateNaissance) {
    const naissance = new Date(dateNaissance);
    const aujourdHui = new Date();

    let age = aujourdHui.getFullYear() - naissance.getFullYear();
    const mois = aujourdHui.getMonth() - naissance.getMonth();
    const jour = aujourdHui.getDate() - naissance.getDate();

    // Vérifie si l'anniversaire est passé cette année
    if (mois < 0 || (mois === 0 && jour < 0)) {
        age--;
    }

    return age;
}

module.exports = router;