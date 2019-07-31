const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.author_list = function(req, res) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, author_list) {
      if (err) {return next(err);}
      res.render('author_list', {title: 'Author List', author_list: author_list});
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
    if (err) {return next(err);}
    if (results.author == null) {
      const err = new Error('author not found');
      err.status = 404;
      return next(err);
    }
    res.render('author_detail', {title: 'Author: ' + results.author.name, author: results.author, author_books: results.author_books})
  })
};

exports.author_create_get = function(req, res) {
  res.render('author_form', {title: 'Create Author'})
};

exports.author_create_post = [
  body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.'),
  body('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.'),
  body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

  sanitizeBody('first_name').escape(),
  sanitizeBody('family_name').escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
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
        if (err) {return next(err); }
        res.redirect(author.url);
      })
    }
  }
];

exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete get');
};

exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete post');
};

exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update get');
};

exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update post');
};

