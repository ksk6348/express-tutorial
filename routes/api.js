const express = require('express');
const router = express.Router();

// Require controller modules.
const book_controller = require('../api/bookController');
const author_controller = require('../api/authorController');
const genre_controller = require('../api/genreController');
const book_instance_controller = require('../api/bookinstanceController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/books/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/books/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/books/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/books/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/books/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/books/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/books/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// POST request for creating Author.
router.post('/authors', author_controller.author_create);

// GET request to delete Author.
router.delete('/authors/:id', author_controller.author_delete);

// POST request to update Author.
router.put('/authors/:id', author_controller.author_update);

// GET request for one Author.
router.get('/authors/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

//POST request for creating Genre.
router.post('/genres', genre_controller.genre_create);

// POST request to delete Genre.
router.delete('/genres/:id', genre_controller.genre_delete);

// POST request to update Genre.
router.put('/genres/:id', genre_controller.genre_update);

// GET request for one Genre.
router.get('/genres/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstances/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/bookinstances/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstances/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstances/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstances/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstances/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstances/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;
