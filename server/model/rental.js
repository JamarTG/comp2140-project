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
    dueDate: {
      type: Date,
      required: true,
    },
    gradeLevel: {
      type: Number,
      required: true,
  }
});

const RentalDetail = mongoose.model('RentalDetail', rentalDetailSchema);
module.exports = RentalDetail;