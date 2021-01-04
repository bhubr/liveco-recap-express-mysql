const express = require('express');
require('dotenv').config();
const pool = require('./pool');

// Initialiser l'appli Express
const app = express();

// Permettre d'analyser les donnees entrantes en JSON
app.use(express.json());

app.get('/api/movies', (req, res) => {
  pool.query(
    'SELECT * FROM movie',
    (err, movies) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else {
        res.json(movies);
      }
    },
  );
});

app.get('/api/movies/:movieId', (req, res) => {
  pool.query(
    'SELECT * FROM movie WHERE id = ?',
    [req.params.movieId],
    (err, movies) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (movies.length === 0) {
        res.status(404).json({
          error: 'Movie not found',
        });
      } else {
        res.json(movies[0]);
      }
    },
  );
});

app.post('/api/movies', (req, res) => {
  pool.query(
    'INSERT INTO movie (title,picture) VALUES(?,?)',
    [req.body.title, req.body.picture],
    (err, status) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else {
        // Creation d'un objet qu'on va renvoyer au client
        // representant la nouvelle ressource
        const insertedMovie = {
          id: status.insertId,
          title: req.body.title,
          picture: req.body.picture,
        };
        res.status(201).json(insertedMovie);
      }
    },
  );
});

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Express server running');
  }
});
