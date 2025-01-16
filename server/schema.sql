CREATE DATABASE ikna;
USE ikna;

CREATE TABLE users (
    id char(32),
	username varchar(20),
  	passwordHash char(48),
    passwordSalt char(32),
    settings: text
);
CREATE TABLE cards (
    id char(32),
    userId char(32),
    deckId char(32),
	front text,
    back text,
    lastReview timestamp,
    nextInterval int
);
CREATE TABLE decks (
    id char(32),
    userId char(32),
	title tinytext
);