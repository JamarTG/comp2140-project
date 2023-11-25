const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  gradeLevel: {
    type: Number,
    required: true,
  },
  authors: {
    type: [String], 
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;