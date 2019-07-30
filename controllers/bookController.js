const Author = require('../models/author');
const Book = require('../models/book');
const Bookinstance = require('../models/bookinstance');
const Genre = require('../models/genre');

const async = require('async');


exports.index = function(req, res) {
  async.parallel({
    book_count: function (callback) {
      Book.countDocuments({}, callback);
    },
    book_instance_count: function (callback) {
      Bookinstance.countDocuments({}, callback);
    },
    book_instance_available_count: function (callback) {
      Bookinstance.countDocuments({status: 'Available'}, callback);
    },
    author_count: function (callback) {
      Author.countDocuments({}, callback);
    },
    genre_count: function (callback) {
      Genre.countDocuments({}, callback);
    }
  }, function(err, results) {
    console.log(results);
    res.render('index', {title: 'local library home', error: err, data: results})
  })
};

// Display list of all books.
exports.book_list = function(req, res) {
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if(err) {return next(err);}
      res.render('book_list', {title: 'Book list', book_list: list_books});
    })
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instances: function (callback) {
      Bookinstance.find({'book': req.params.id})
        .exec(callback);
    }
  }, function (err, results) {
    if (err) {return next(err);}
    if (results.book == null) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    res.render('book_detail', {title: 'Book Detail', book: results.book, book_instances: results.book_instances})
  })
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};
