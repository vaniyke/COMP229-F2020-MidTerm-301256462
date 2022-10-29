// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const books = require('../models/books');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', {
    title: 'Add book',
    books: books,
    id: null
  })
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  
  const newBook = new book({
    Title: req.body.title,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre,
  });
  newBook.save()
  .then(
    res.redirect('/books')
  )
  .catch(err => {
    res.status(400).send('Unable to add book to database')
  })

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  const bookToEdit = book.findById(req.params.id, (err, book) => {
    if (err) {
        console.log(err)
    } else {
        res.render('books/details', { title: 'Edit book', books: book, id: req.params.id})
    }
})
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  book.findByIdAndUpdate(req.params.id, {
    Title: req.body.title,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre,
  }, (err, doc) => {
    if (!err) {
        res.redirect('/books');
    } else {
        console.log('Failed to Update Book: ' + err);
    }
})
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  book.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
        res.redirect('/books');
    } else {
        console.log('Failed to Delete Book: ' + err);
    }
});
});


module.exports = router;
