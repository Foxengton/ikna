CREATE DATABASE ikna;
USE ikna;

CREATE TABLE users (
    id int PRIMARY KEY AUTO_INCREMENT,
	username varchar(20),
  	passwordHash char(100),
    passwordSalt char(32),
    settings text
);
CREATE TABLE cards (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId char(32),
    deckId char(32),
	front text,
    back text,
    lastReview timestamp,
    nextInterval int
);
CREATE TABLE decks (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId char(32),
	deckName tinytext
);