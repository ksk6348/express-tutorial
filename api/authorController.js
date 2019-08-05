const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.author_list = function(req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, author_list) {
      if (err) {res.next(err);}
      res.json(author_list);
    })
};

exports.author_detail = function(req, res, next) {
  async.parallel({
    author: function (callback) {
      Author.findById(req.params.id)
        .exec(callback);
    },
    author_books: function (callback) {
      Book.find({'author': req.params.id})
        .exec(callback);
    }
  }, function (err, results) {
    if (err) {next(err);}
    if (results.author == null) {
      const err = new Error('author not found');
      err.status = 404;
      next(err);
    }
    console.log(results.author);
    const author_detail = Object.assign({}, results.author._doc, { books: results.author_books});
    res.json(author_detail)
  })
};

exports.author_create = [
  check('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.'),
  check('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.'),
  check('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
  check('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

  sanitizeBody('first_name').escape(),
  sanitizeBody('family_name').escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.status = 400;
      next(errors)
    }
    else {
      const author = new Author(
        {
          first_name: req.body.first_name,
          family_name: req.body.family_name,
          date_of_birth: req.body.date_of_birth,
          date_of_death: req.body.date_of_death,
        }
      );
      author.save(function (err) {
        if (err) { res.next(err); }
        res.status(201).json(author)
      })
    }
  }
];

exports.author_delete = function(req, res, next) {
  Author.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
    if (err) { next(err); }
    res.json({})
  })
};

exports.author_update = [
  check('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.'),
  check('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.'),
  check('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
  check('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

  sanitizeBody('first_name').escape(),
  sanitizeBody('family_name').escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.status = 400;
      next(errors)
    }
    Author.findByIdAndUpdate(req.params.id, req.body, { new: true }, function updateAuthor(err, result) {
      if (err) { next(err); }
      res.json(result)
    })
  }
];

