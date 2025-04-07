require('dotenv').config();
const pool = require('./db');

const createTables = async () => {
  const query = `
    --- Create the tables
    CREATE TABLE Membres (
        Id SERIAL PRIMARY KEY,
        prenom VARCHAR(25) NOT NULL,
        nom VARCHAR(25) NOT NULL,
        genre CHAR(1) CHECK (genre IN ('H', 'F', 'K')) NOT NULL,
        age INTEGER NOT NULL,
        date_naissance DATE NOT NULL,
        victoires INTEGER DEFAULT 0, 
        defaites INTEGER DEFAULT 0,   
        rang VARCHAR(25) NOT NULL
    );

    INSERT INTO "membres" ("prenom", "nom", "genre", "age", "date_naissance", "victoires", "defaites", "rang") VALUES
	('Emma', 'Durand', 'F', 30, '1994-08-21', 0, 0, 'Femme'),
    ('Sophie', 'Lefevre', 'F', 40, '1984-02-10', 0, 0, 'Femme'),
    ('Isabelle', 'Moreau', 'F', 35, '1989-11-05', 0, 0, 'Femme'),
	('Léo', 'Simon', 'H', 17, '2007-03-30', 0, 0, 'Junior'),
	('Hugo', 'Lemoine', 'H', 28, '1996-07-09', 0, 0, 'Sénior'),
	('Grégory', 'Henry', 'H', 70, '1954-08-03', 0, 0, 'Vétéran')`;

try {
    await pool.query(query);
    console.log('✅ Database initialized with tables and dummy data.');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  } finally {
    pool.end();
  }
};

createTables();