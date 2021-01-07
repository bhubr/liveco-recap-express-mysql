CREATE TABLE IF NOT EXISTS performer (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS movie_performer (
  movie_id INTEGER NOT NULL,
  performer_id INTEGER NOT NULL,
  PRIMARY KEY(movie_id, performer_id)
);

ALTER TABLE movie_performer
ADD CONSTRAINT fk_movie_performer_movie_1
FOREIGN KEY(movie_id) REFERENCES movie(id);

ALTER TABLE movie_performer
ADD CONSTRAINT fk_movie_performer_performer_1
FOREIGN KEY(performer_id) REFERENCES performer(id);