const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const validator = require('express-validator');


// Display list of all Genre.
exports.genre_list = function(req, res) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, genre_list) {
      if (err) { return res.status(500).json(err); }
      res.json(genre_list);
    })
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res) {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.params.id)
        .exec(callback);
    },
    genre_books: function (callback) {
      Book.find({ 'genre': req.params.id })
        .exec(callback);
    }
  }, function (err, results) {
    if (err) {return res.status(500).json(err);}
    if (results.genre == null) {
      const err = new Error('Genre not found');
      return res.status(404).json(err);
    }
    const genreDetail = Object.assign({}, results.genre._doc, { books: results.genre_books });
    res.json(genreDetail)
  })
};

// Handle Genre create on POST.
exports.genre_create = [
  validator.body('name', 'Genre name required').isLength({min: 1}).trim(),
  validator.sanitizeBody('name').escape(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    const genre = new Genre(
      {name: req.body.name}
    );
    if (!errors.isEmpty()) {
      res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    }
    else {
      Genre.findOne({'name': req.body.name})
        .exec(function(err, found_genre) {
          if (err) {return next(err);}

          if (found_genre) {
            res.redirect(found_genre.url)
          }
          else {
            genre.save(function (err) {
              if (err) {return next(err);}
              res.redirect(genre.url);
            })
          }
        })

    }
  }
];

// Handle Genre delete on POST.
exports.genre_delete = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Handle Genre update on PUT.
exports.genre_update = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
