const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');

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
  res.send('NOT IMPLEMENTED: Author create get');
};

exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create post');
};

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

