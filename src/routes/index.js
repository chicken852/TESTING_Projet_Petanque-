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

router.get('/score-team', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'score-team.html'));  // Serve score-team.html
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

router.post('/api/teams/:id/score', async (req, res) => {
    const { id } = req.params;  // Get team ID from URL params
    const { score } = req.body; // Get score from request body

    try {
        // Update the team's score in the database
        const result = await pool.query(
            'UPDATE Equipes SET score = $1 WHERE id = $2 RETURNING *',
            [score, id]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Score updated successfully', team: result.rows[0] });
        } else {
            res.status(404).send('Team not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/api/current-matches', async (req, res) => {
    try {
        const query = `
            SELECT 
                me.match_id, 
                e1.type AS equipe1_type, 
                e2.type AS equipe2_type, 
                e1.score AS equipe1_score, 
                e2.score AS equipe2_score, 
                t.id AS terrain_id, 
                t.type AS terrain_type
            FROM match_equipes me
            JOIN Equipes e1 ON e1.Id = me.equipe1
            JOIN Equipes e2 ON e2.Id = me.equipe2
            JOIN terrains t ON t.Id = me.terrain_id;
        `;
        const result = await pool.query(query);
        res.json(result.rows);  // Send the result with team scores and terrain information
    } catch (error) {
        console.error('Error fetching current matches:', error);
        res.status(500).json({ error: 'Error fetching matches' });
    }
});

router.post('/api/update-match-score/:matchId', async (req, res) => {
    const { matchId } = req.params;
    const { team1Score, team2Score } = req.body;

    // Ensure the scores are integers (parse with radix 10)
    const team1ScoreInt = parseInt(team1Score, 10);
    const team2ScoreInt = parseInt(team2Score, 10);

    // Check if the scores are valid integers
    if (isNaN(team1ScoreInt) || isNaN(team2ScoreInt)) {
        return res.status(400).json({ error: 'Both scores must be valid numbers' });
    }

    console.log(`Team 1 Score: ${team1ScoreInt}, Team 2 Score: ${team2ScoreInt}`);  // Log for debugging

    try {
        // Update the teams' scores in the Equipes table
        const updateScoreQuery = `
            UPDATE Equipes
            SET score = CASE
                WHEN Id = (SELECT equipe1 FROM match_equipes WHERE match_id = $1) THEN $2::int
                WHEN Id = (SELECT equipe2 FROM match_equipes WHERE match_id = $1) THEN $3::int
            END
            WHERE Id IN (SELECT equipe1 FROM match_equipes WHERE match_id = $1)
               OR Id IN (SELECT equipe2 FROM match_equipes WHERE match_id = $1);
        `;
        
        // Run the query with proper values (ensure integer types)
        await pool.query(updateScoreQuery, [matchId, team1ScoreInt, team2ScoreInt]);

        res.status(200).json({ message: 'Scores updated successfully' });
    } catch (error) {
        console.error('Error updating scores:', error);
        res.status(500).json({ error: 'Error updating scores' });
    }
});

router.get('/api/teams/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM Equipes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching team:', err);
        res.status(500).json({ error: 'Server error' });
    }
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

///// Changes
router.post('/api/assign-fields', async (req, res) => {
    const { teamPairs } = req.body; // Each item: { equipe1Id, equipe2Id }
  
    try {
      const availableTerrainsResult = await pool.query(
        'SELECT id FROM terrains WHERE disponible = TRUE LIMIT $1',
        [teamPairs.length]
      );
      const availableTerrains = availableTerrainsResult.rows;
  
      if (availableTerrains.length < teamPairs.length) {
        return res.status(400).json({ error: 'Not enough available terrains' });
      }
  
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        for (let i = 0; i < teamPairs.length; i++) {
          const { equipe1Id, equipe2Id } = teamPairs[i];
          const terrainId = availableTerrains[i].id;
  
          // Insert match
          await client.query(
            'INSERT INTO match_equipes (equipe1, equipe2, terrain_id) VALUES ($1, $2, $3)',
            [equipe1Id, equipe2Id, terrainId]
          );
  
          // Set terrain as unavailable
          await client.query(
            'UPDATE terrains SET disponible = FALSE WHERE id = $1',
            [terrainId]
          );
        }
  
        await client.query('COMMIT');
        res.json({ message: 'Fields assigned and matches recorded successfully.' });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
  
    } catch (error) {
      console.error('Error assigning fields:', error);
      res.status(500).json({ error: 'Erreur lors de l\'attribution des terrains.' });
    }
  });
  



/// End of changes

// Endpoint to fetch all teams with their members' names
router.get('/api/all-teams', async (req, res) => {
    const client = await pool.connect();
    try {
        // Fetch teams and their members' names
        const result = await client.query(`
            SELECT 
                e.id AS team_id, 
                e.type, 
                e.score,
                m1.prenom AS member1_firstname, m1.nom AS member1_lastname,
                m2.prenom AS member2_firstname, m2.nom AS member2_lastname,
                m3.prenom AS member3_firstname, m3.nom AS member3_lastname
            FROM Equipes e
            LEFT JOIN Membres_Equipes me ON e.id = me.equipe_id
            LEFT JOIN Membres m1 ON me.membre1 = m1.id
            LEFT JOIN Membres m2 ON me.membre2 = m2.id
            LEFT JOIN Membres m3 ON me.membre3 = m3.id
        `);

        const teams = result.rows.map(row => ({
            team_id: row.team_id,
            type: row.type,
            score: row.score,
            members: [
                row.member1_firstname && row.member1_lastname ? `${row.member1_firstname} ${row.member1_lastname}` : null,
                row.member2_firstname && row.member2_lastname ? `${row.member2_firstname} ${row.member2_lastname}` : null,
                row.member3_firstname && row.member3_lastname ? `${row.member3_firstname} ${row.member3_lastname}` : null
            ].filter(member => member)  // Filter out null values
        }));

        res.json(teams);
    } catch (err) {
        console.error('Error fetching teams:', err);
        res.status(500).json({ error: 'Failed to fetch teams' });
    } finally {
        client.release();
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