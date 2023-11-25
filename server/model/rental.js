const mongoose = require('mongoose');

const rentalDetailSchema = new mongoose.Schema({
    studentName: {
      type: String,
      required: true,
    },
    schoolID: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: true,
    },
    books: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    }],
    dueDate: {
      type: Date,
      required: true,
    }
});

const RentalDetail = mongoose.model('RentalDetail', rentalDetailSchema);
module.exports = RentalDetail;