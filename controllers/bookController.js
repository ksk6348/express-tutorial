const Author = require('../models/author');
const Book = require('../models/book');
const Bookinstance = require('../models/bookinstance');
const Genre = require('../models/genre');

const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


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
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel({
    authors: function(callback) {
      Author.find(callback);
    },
    genres: function(callback) {
      Genre.find(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
};

// Handle book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)){
      if (typeof req.body.genre==='undefined') {
        req.body.genre = [];
      }
      else {
        req.body.genre = new Array(req.body.genre);
      }
      next();
    }
  },
  body('title', 'Title must not be empty').isLength({min: 1}).trim(),
  body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
  body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
  body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

  // Sanitize fields (using wildcard).
  sanitizeBody('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book(
      {
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre
      }
    );

    if (!errors.isEmpty()) {
      async.parallel({
        authors: function(callback) {
          Author.find(callback);
        },
        genres: function(callback) {
          Genre.find(callback)
        }
      }, function (err, results) {
        if (err) {return next(err);}

        for (let i = 0; i < results.genres.length; i ++) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('book_form', {title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array()})
      });
      return;
    }
    else {
      book.save(function(err) {
        if(err) { return next(err); }
        res.redirect(book.url);
      })
    }
  }
];

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
