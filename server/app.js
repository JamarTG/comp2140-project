const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const db = require("./db");

// models
const User = require("./model/user");
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

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existingUserCount = await User.countDocuments();

  if (existingUserCount > 0) {
    return res
      .status(400)
      .json({ message: "User already exists. Registration not allowed." });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid username or password, Please try again" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await user.comparePassword(password);

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

   

    res.json({
      data: books,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve books for the grade level" });
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
      const newBook = new Book({
        title,
        price,
        gradeLevel,
        authors,
        publisher,
        ISBN,
      });
      const savedBook = await newBook.save();
      res.json({ message: "Book added successfully", data: savedBook });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to add/update book in the database" });
  }
});

app.post("/rental", async (req, res) => {
  const { studentName, schoolID, contact, dueDate, gradeLevel } = req.body;

  try {
    const existingRental = await Rental.findOne({ schoolID });

    if (existingRental) {
      existingRental.studentName = studentName;
      existingRental.contact = contact;
      existingRental.dueDate = dueDate;
      const updatedRental = await existingRental.save();
      res.json({
        message: "Rental Details updated successfully",
        data: updatedRental,
      });
    } else {
      const rentalDetail = new Rental({
        studentName,
        schoolID,
        contact,
        dueDate,
        gradeLevel,
      });

      const savedRentalDetail = await rentalDetail.save();
      res.json({
        message: "Rental Details added successfully",
        data: savedRentalDetail,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to save rental details to the database" });
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

app.get("/overdue-rentals", async (req, res) => {
  try {
    const today = new Date();
    const overdueBooks = await Rental.find({ dueDate: { $lt: today } });
    res.json({ data: overdueBooks });
  } catch (error) {
    res.status(500).json({ error: "Failed to get overdue rentals" });
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
