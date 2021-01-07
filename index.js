const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./pool');

// Initialiser l'appli Express
const app = express();

// Permet d'autoriser des requêtes Cross-Origin
app.use(cors());

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
    'INSERT INTO movie (title,picture,category_id) VALUES(?,?,?)',
    [req.body.title, req.body.picture, req.body.category_id],
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
          category_id: req.body.category_id,
        };
        res.status(201).json(insertedMovie);
      }
    },
  );
});

app.post('/api/categories', (req, res) => {
  pool.query(
    'INSERT INTO category (name) VALUES(?)',
    [req.body.name],
    (err, status) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else {
        // Creation d'un objet qu'on va renvoyer au client
        // representant la nouvelle ressource
        const insertedCategory = {
          id: status.insertId,
          name: req.body.name,
        };
        res.status(201).json(insertedCategory);
      }
    },
  );
});

// http://localhost:5000/api/categories/3/movies
// http://blog.com/users/12/comments
app.get('/api/categories/:categoryId/movies', (req, res) => {
  // En principe, si on veut faire les choses "proprement",
  // on doit d'abord vérifier que la catégorie existe
  const { categoryId } = req.params;

  pool.query(
    'SELECT * FROM category WHERE id = ?',
    [categoryId],
    (err, categories) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (categories.length === 0) {
        res.status(404).json({
          error: 'Category not found',
        });
      } else {
        pool.query(
          'SELECT * FROM movie WHERE category_id = ?',
          [req.params.categoryId],
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
      }
    }
  );
});

app.post('/api/performers', (req, res) => {
  pool.query(
    'INSERT INTO performer (name) VALUES(?)',
    [req.body.name],
    (err, status) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else {
        // Creation d'un objet qu'on va renvoyer au client
        // representant la nouvelle ressource
        const insertedPerformer = {
          id: status.insertId,
          name: req.body.name,
        };
        res.status(201).json(insertedPerformer);
      }
    },
  );
});

app.put('/api/movies/:movieId/performers/:performerId', (req, res) => {
  const { movieId, performerId } = req.params;
  pool.query(
    'INSERT INTO movie_performer (movie_id,performer_id) VALUES(?,?)',
    [movieId, performerId],
    (err, status) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else {
        res.sendStatus(204);
      }
    },
  );
});

app.get('/api/movies/:movieId/performers', (req, res) => {
  // Je dois sélectionner les acteurs (performers) associés à movieId
  pool.query(
    `
    SELECT * FROM performer
    JOIN movie_performer ON performer.id = movie_performer.performer_id
    WHERE movie_performer.movie_id = ?
    `,
    [req.params.movieId],
    (err, performers) => {
      if (err) {
        res.status(500).json({
          error: err.message
        })
      } else {
        res.json(performers);
      }
    }
  )
});

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Express server running');
  }
});
