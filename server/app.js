const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

// models
const Book = require("./model/book");
const Rental = require("./model/rental");
const app = express();
const port = 3000;

// page to view the oustanding books / filter
// add the rental details
// calculate fine for overdue books
// 

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client")));


app.post("/books", async (req, res) => {
  const { title, price, gradeLevel, authors, publisher, ISBN } = req.body;
  const book = new Book({ title, price, gradeLevel, authors, publisher, ISBN });

  try {
    const savedBook = await book.save();
    res.json({ message: "Book added successfully", data: savedBook });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add book to the database" });
  }
  // {
  //   "title": "Sample Book",
  //   "price": 15.99,
  //   "gradeLevel": 6,
  //   "authors": ["Author 1", "Author 2"],
  //   "publisher": "PublishCo",
  //   "ISBN": "978-0-123456-78-9"
  // }
});

app.post("/rental", async (req, res) => {
  const { studentName, schoolID, contact, bookIDs, dueDate } = req.body;

  try {
    // Create a new rental record with student details and multiple books
    const rentalDetail = new Rental({
      studentName,
      schoolID,
      contact,
      books: bookIDs,
      dueDate,
    });

    const savedRentalDetail = await rentalDetail.save();
    res.json({
      message: "Rental Details added successfully",
      data: savedRentalDetail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save rental details to the database" });
  }
});


app.get("/rental-details", async (req, res) => {
  try {
    const allRentalDetails = await Rental.find();
    res.json({ data: allRentalDetails });
  } catch (error) {
    res.status(500).json({ error: "Failed to get all rental details" });
  }
});

app.get("/overdue-books", async (req, res) => {
  try {
    const today = new Date();
    const overdueBooks = await Book.find({ dueDate: { $lt: today } });
    res.json({ data: overdueBooks });
  } catch (error) {
    res.status(500).json({ error: "Failed to get overdue books" });
  }
});

app.put("/book-returns/:rentalID", async (req, res) => {
  const rentalID = req.params.rentalID;

  try {
    const rental = await Rental.findById(rentalID);

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    await rental.remove(); 

    res.json({ message: "Book return successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process book return" });
  }
});

app.post("/modify-rental", async (req, res) => {
  const { studentName, schoolID, contact, bookIDs, dueDate } = req.body;

  try {
    const existingRental = await Rental.findOne({ schoolID }); // Assuming schoolID is unique

    if (!existingRental) {
      return res.status(404).json({ error: "Rental detail not found" });
    }

    // Modify the existing rental detail
    existingRental.studentName = studentName;
    existingRental.contact = contact;
    existingRental.books = bookIDs;
    existingRental.dueDate = dueDate;

    const updatedRentalDetail = await existingRental.save();

    res.json({
      message: "Rental Details updated successfully",
      data: updatedRentalDetail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update rental details in the database" });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
