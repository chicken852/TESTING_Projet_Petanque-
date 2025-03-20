-- Create the database (if not exists, run manually if needed)
CREATE DATABASE petanque_db;

--- Create the tables
CREATE TABLE Members (
    Id SERIAL PRIMARY KEY,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')) NOT NULL,
    age INTEGER NOT NULL,
    birthday DATE NOT NULL,
    victories INTEGER DEFAULT 0, 
    defeats INTEGER DEFAULT 0  
);


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