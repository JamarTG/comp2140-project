const displayBooks = async (gradeLevel) => {
  const bookDropdown = document.getElementById("book-display");

  try {
    const response = await fetch(`http://localhost:3000/books/${gradeLevel}`);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const { data } = await response.json();

    bookDropdown.innerHTML = "";
    data.forEach((book) => {
      const bookTitle = document.createElement("p");
      bookTitle.textContent = `${book.title} by ${book.authors}`;
      bookTitle.style.cursor = "pointer";

      bookDropdown.appendChild(bookTitle);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let saveBookBtn = document.getElementById("saveBook");

  
  saveBookBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const formData = {
      title: document.getElementById("title").value,
      price: parseFloat(document.getElementById("price").value),
      gradeLevel: parseInt(document.getElementById("grade").value),
      authors: document.getElementById("Authors").value.split(","),
      publisher: document.getElementById("Publisher").value,
      ISBN: document.getElementById("ISBN").value,
    };
    try {
      const response = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Book added successfully:", data);
      } else {
        throw new Error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  });

  const saveRentalBtn = document.getElementById("saveRental");

  saveRentalBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const formData = {
      studentName: document.getElementById("studentName").value,
      schoolID: document.getElementById("schoolID").value,
      contact: document.getElementById("contactInfo").value,
      dueDate: document.getElementById("dueDate").value,
    };

    try {
      const response = await fetch("http://localhost:3000/rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Rental details added successfully:", data);
      } else {
        throw new Error("Failed to add rental details");
      }
    } catch (error) {
      console.error("Error adding rental details:", error);
    }
  });
});
