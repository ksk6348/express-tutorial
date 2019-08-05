const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const validator = require('express-validator');


// Display list of all Genre.
exports.genre_list = function(req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, genre_list) {
      if (err) { next(err); }
      res.json(genre_list);
    })
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
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
    if (err) {next(err);}
    if (results.genre == null) {
      const err = new Error('Genre not found');
      err.status = 404;
      next(err);
    }
    const genreDetail = Object.assign({}, results.genre._doc, { books: results.genre_books });
    res.json(genreDetail)
  })
};

// Handle Genre create on POST.
exports.genre_create = [
  validator.check('name', 'Genre name required').isLength({min: 1}).trim(),
  validator.sanitizeBody('name').escape(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      errors.status = 400;
      next(errors);
    }
    else {
      const genre = new Genre(
        {name: req.body.name}
      );
      Genre.findOne({'name': req.body.name})
        .exec(function(err, found_genre) {
          if (err) {next(err);}
          if (found_genre) {
            const err = new Error(`Genre ${genre.name} is existed`);
            err.status = 404;
            next(err)
          }
          else {
            genre.save(function (err) {
              if (err) {next(err);}
              return res.json(genre);
            })
          }
        })

    }
  }
];

// Handle Genre delete on POST.
exports.genre_delete = function(req, res) {
  Genre.findByIdAndRemove(req.params.id, function deleteGenre(err) {
    if (err) {next(err);}
    res.json({})
  })
};

// Handle Genre update on PUT.
exports.genre_update = [
  validator.check('name', 'Genre name required').isLength({min: 1}).trim(),
  validator.sanitizeBody('name').escape(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      errors.status = 400;
      next(errors);
    }
    Genre.findByIdAndUpdate(req.params.id, req.body, { new: true}, function (err, result) {
      if (err) { next(err); }
      res.json(result)
    })
  }
];
