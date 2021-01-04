const express = require('express');
require('dotenv').config();
const pool = require('./pool');

const app = express();

app.get('/movies', (req, res) => {
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

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Express server running');
  }
});
