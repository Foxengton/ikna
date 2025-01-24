CREATE DATABASE ikna;
USE ikna;

CREATE TABLE users (
    id int PRIMARY KEY AUTO_INCREMENT,
	username varchar(20),
  	password_hash char(100),
    password_salt char(44),
    settings text
);
CREATE TABLE cards (
    id int PRIMARY KEY AUTO_INCREMENT,
    user_id int,
    deck_id int,
	card_front text,
    card_back text,
    last_review int,
    next_interval int
);
CREATE TABLE decks (
    id int PRIMARY KEY AUTO_INCREMENT,
    guid char(8),
    user_id int,
	deck_name tinytext,
    card_count int
);