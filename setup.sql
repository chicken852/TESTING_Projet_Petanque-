-- Create the database (if not exists, run manually if needed)
CREATE DATABASE petanque_db;

--- Create the tables
CREATE TABLE Members (
    Id SERIAL PRIMARY KEY,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'K')) NOT NULL,
    age INTEGER NOT NULL,
    birthday DATE NOT NULL,
    victories INTEGER DEFAULT 0, 
    defeats INTEGER DEFAULT 0,   
    rank VARCHAR(25) NOT NULL
);

INSERT INTO "members" ("id", "firstname", "lastname", "gender", "age", "birthday", "victories", "defeats", "rank") VALUES
	(63, 'Emma', 'Durand', 'F', 30, '1994-08-21', 0, 0, 'Senior'),
	(64, 'Sophie', 'Lefevre', 'F', 40, '1984-02-10', 0, 0, 'Senior'),
	(65, 'Isabelle', 'Moreau', 'F', 35, '1989-11-05', 0, 0, 'Senior'),
	(66, 'Julie', 'Fournier', 'F', 22, '2002-06-30', 0, 0, 'Senior'),
	(67, 'Claire', 'Girard', 'F', 55, '1969-09-15', 0, 0, 'Vétéran'),
	(68, 'Camille', 'Bertrand', 'F', 60, '1964-03-25', 0, 0, 'Vétéran'),
	(69, 'Laura', 'Renaud', 'F', 45, '1979-07-20', 0, 0, 'Senior'),
	(70, 'Pauline', 'Blanc', 'F', 50, '1974-12-01', 0, 0, 'Senior'),
	(71, 'Elodie', 'Faure', 'F', 65, '1959-04-10', 0, 0, 'Vétéran'),
	(72, 'Lucas', 'Petit', 'M', 12, '2012-02-18', 0, 0, 'Junior'),
	(73, 'Thomas', 'Robert', 'M', 14, '2010-06-25', 0, 0, 'Junior'),
	(74, 'Emma', 'Garcia', 'F', 10, '2014-09-12', 0, 0, 'Junior'),
	(75, 'Nathan', 'David', 'M', 16, '2008-11-05', 0, 0, 'Junior'),
	(76, 'Léo', 'Simon', 'M', 17, '2007-03-30', 0, 0, 'Junior'),
	(77, 'Antoine', 'Dubois', 'M', 20, '2004-01-15', 0, 0, 'Senior'),
	(78, 'Hugo', 'Lemoine', 'M', 28, '1996-07-09', 0, 0, 'Senior'),
	(79, 'Matthieu', 'Chevalier', 'M', 35, '1989-05-22', 0, 0, 'Senior'),
	(80, 'Vincent', 'Benoit', 'M', 45, '1979-02-11', 0, 0, 'Senior'),
	(81, 'Jean', 'Rousseau', 'M', 55, '1969-10-30', 0, 0, 'Vétéran'),
	(82, 'Olivier', 'Lambert', 'M', 65, '1959-08-19', 0, 0, 'Vétéran'),
	(83, 'Daniel', 'Morel', 'M', 75, '1949-06-05', 0, 0, 'Vétéran'),
	(84, 'Maxime', 'Leroy', 'M', 38, '1986-09-14', 0, 0, 'Senior'),
	(85, 'Alexandre', 'Fischer', 'M', 42, '1982-12-03', 0, 0, 'Senior'),
	(86, 'François', 'Martinez', 'M', 52, '1972-04-21', 0, 0, 'Vétéran'),
	(87, 'Yann', 'Gauthier', 'M', 18, '2006-07-01', 0, 0, 'Senior'),
	(88, 'Nicolas', 'Bourgeois', 'M', 24, '2000-03-29', 0, 0, 'Senior'),
	(89, 'Julien', 'Carpentier', 'M', 27, '1997-12-10', 0, 0, 'Senior'),
	(90, 'Damien', 'Renaud', 'M', 31, '1993-05-15', 0, 0, 'Senior'),
	(91, 'Bruno', 'Dumas', 'M', 48, '1976-02-25', 0, 0, 'Senior'),
	(92, 'Patrick', 'Olivier', 'M', 58, '1966-09-07', 0, 0, 'Vétéran'),
	(93, 'Cédric', 'Renard', 'M', 62, '1962-04-14', 0, 0, 'Vétéran'),
	(94, 'Grégory', 'Henry', 'M', 70, '1954-08-03', 0, 0, 'Vétéran'),
	(95, 'Philippe', 'Barbier', 'M', 78, '1946-11-22', 0, 0, 'Vétéran'),
	(96, 'Alain', 'Dupont', 'M', 80, '1944-06-18', 0, 0, 'Vétéran'),
	(97, 'Éric', 'Marchand', 'M', 22, '2002-09-30', 0, 0, 'Senior'),
	(98, 'Thierry', 'Leclerc', 'M', 37, '1987-01-12', 0, 0, 'Senior'),
	(99, 'Kevin', 'Guillaume', 'M', 47, '1977-05-08', 0, 0, 'Senior'),
	(100, 'Sylvain', 'Arnaud', 'M', 54, '1970-03-02', 0, 0, 'Vétéran'),
	(101, 'Michel', 'Fabre', 'M', 60, '1964-07-21', 0, 0, 'Vétéran'),
	(102, 'Loïc', 'André', 'M', 67, '1957-09-11', 0, 0, 'Vétéran'),
	(103, 'Jean-Paul', 'Noel', 'M', 74, '1950-12-05', 0, 0, 'Vétéran'),
	(104, 'Fabrice', 'Gonzalez', 'M', 40, '1984-06-17', 0, 0, 'Senior'),
	(105, 'Laurent', 'Vidal', 'M', 46, '1978-08-23', 0, 0, 'Senior'),
	(106, 'Jean-Marc', 'Morin', 'M', 57, '1967-02-09', 0, 0, 'Vétéran'),
	(107, 'Stéphane', 'Chauvet', 'M', 68, '1956-05-29', 0, 0, 'Vétéran'),
	(108, 'Didier', 'Perrot', 'M', 72, '1952-10-14', 0, 0, 'Vétéran'),
	(109, 'Gilles', 'Legendre', 'M', 79, '1945-03-27', 0, 0, 'Vétéran'),
	(110, 'Jean-François', 'Collin', 'M', 77, '1947-12-18', 0, 0, 'Vétéran'),
	(111, 'Serge', 'Blanchard', 'M', 66, '1958-09-30', 0, 0, 'Vétéran'),
	(112, 'Denis', 'Adam', 'M', 44, '1980-11-03', 0, 0, 'Senior'),
	(113, 'Bernard', 'Lemoine', 'M', 53, '1971-02-14', 0, 0, 'Vétéran'),
	(114, 'Arnaud', 'Gérard', 'M', 23, '2001-06-07', 0, 0, 'Senior'),
	(115, 'Patrick', 'Delacroix', 'M', 34, '1990-09-05', 0, 0, 'Senior');



CREATE TABLE Teams (
    Id SERIAL PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('double', 'triple')) NOT NULL
);

CREATE TABLE Matches (
    Id SERIAL PRIMARY KEY,
    challenge_type VARCHAR(10) CHECK (challenge_type IN ('summer', 'winter')) NOT NULL,
    field_number INTEGER NOT NULL,
    indoor BOOLEAN NOT NULL
);

CREATE TABLE Match_Teams (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES Matches(Id) ON DELETE CASCADE,
    team_1 INTEGER REFERENCES Teams(Id) ON DELETE CASCADE,
    team_2 INTEGER REFERENCES Teams(Id) ON DELETE CASCADE
);

CREATE TABLE Scores (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES Matches(Id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES Teams(Id) ON DELETE CASCADE,
    score INTEGER NOT NULL
);
