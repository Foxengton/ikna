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
    userId int,
    deckId int,
	cardFront text,
    cardBack text,
    lastReview timestamp,
    nextInterval int
);
CREATE TABLE decks (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int,
	deckName tinytext
);