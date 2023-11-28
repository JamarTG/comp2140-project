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



app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});


app.get("/books/:gradeLevel", async (req, res) => {
  const { gradeLevel } = req.params;

  try {
    const books = await Book.find({ gradeLevel: parseInt(gradeLevel) });

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found for this grade level" });
    }

    res.json({ message: `Books for grade level ${gradeLevel} retrieved successfully`, data: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve books for the grade level" });
  }
});


app.post("/books", async (req, res) => {
  const { title, price, gradeLevel, authors, publisher, ISBN } = req.body;

  try {
    const existingBook = await Book.findOne({ ISBN });

    if (existingBook) {
      existingBook.title = title;
      existingBook.price = price;
      existingBook.gradeLevel = gradeLevel;
      existingBook.authors = authors;
      existingBook.publisher = publisher;

      const updatedBook = await existingBook.save();
      res.json({ message: "Book updated successfully", data: updatedBook });
    } else {
      const newBook = new Book({ title, price, gradeLevel, authors, publisher, ISBN });
      const savedBook = await newBook.save();
      res.json({ message: "Book added successfully", data: savedBook });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add/update book in the database" });
  }
});


app.post("/rental", async (req, res) => {
  const { studentName, schoolID, contact, bookIDs, dueDate } = req.body;

  try {
    // Check if there's an existing rental for the same student ID
    const existingRental = await Rental.findOne({ schoolID });

    if (existingRental) {
      // If a rental for the same student ID exists, update its details
      existingRental.studentName = studentName;
      existingRental.contact = contact;
      existingRental.dueDate = dueDate;

      // Add the new bookIDs to the existing rental's books array

      const updatedRental = await existingRental.save();
      res.json({
        message: "Rental Details updated successfully",
        data: updatedRental,
      });
    } else {
      // If no rental for the same student ID exists, create a new rental
      const rentalDetail = new Rental({
        studentName,
        schoolID,
        contact,
        dueDate,
      });

      const savedRentalDetail = await rentalDetail.save();
      res.json({
        message: "Rental Details added successfully",
        data: savedRentalDetail,
      });
    }
  } catch (error) {
    console.error(error);
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

    await rental.deleteOne(); 

    res.json({ message: "Book return successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process book return" });
  }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
