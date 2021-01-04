const express = require('express');
require('dotenv').config();
const pool = require('./pool');

const app = express();

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

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Express server running');
  }
});
