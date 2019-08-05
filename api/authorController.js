const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.author_list = function(req, res) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, author_list) {
      if (err) {return res.send(err);}
      res.json(author_list);
    })
};

exports.author_detail = function(req, res) {
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
    if (err) {return res.status(400).json(err);}
    if (results.author == null) {
      const err = new Error('author not found');
      return res.status(404).json(err);
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
      return res.status(400).json(errors)
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
        if (err) {return res.status(400).json(err); }
        res.status(201).json(author)
      })
    }
  }
];

exports.author_delete = function(req, res) {
  Author.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
    if (err) { return res.status(500).json(err); }
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
      return res.status(400).json(errors)
    }
    Author.findByIdAndUpdate(req.params.id, req.body, { new: true }, function updateAuthor(err, result) {
      if (err) { return res.status(500).json(err); }
      res.json(result)
    })
  }
];

