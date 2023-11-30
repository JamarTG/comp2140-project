function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }, 100);
}

const viewBooksBtn = document.getElementById("viewBooks");

viewBooksBtn.onclick = (event) => {
  event.preventDefault();
  const gradeLevelValue = document.getElementById("rentalGradeLevel").value;
  displayBooks(gradeLevelValue);
};

const displayBooks = async (gradeLevel) => {
  if (gradeLevel < 0 || gradeLevel > 8) {
    throw new Error("Grade Levels range from 1 - 7");
  }

  const bookModal = document.getElementById("bookModal");
  const bookDisplayModal = document.getElementById("book-display-modal");

  try {
    const response = await fetch(`http://localhost:3000/books/${gradeLevel}`);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const { data } = await response.json();

    bookDisplayModal.innerHTML = "";

    const gradeMapping = {
      1: "1st Form",
      2: "2nd Form",
      3: "3rd Form",
      4: "4th Form",
      5: "5th Form",
      6: "Lower 6th",
      7: "Upper 6th",
    };

    if (!data.length) {
      const noData = document.createElement("p");
      noData.textContent = `No Rental Books for ${gradeMapping[gradeLevel]}`;
      bookDisplayModal.append(noData);
    } else {
      const displayModalTitle = document.createElement("h1");

      displayModalTitle.textContent = `${gradeMapping[gradeLevel]} Rental Books`;
      bookDisplayModal.append(displayModalTitle);
    }

    data.forEach((book) => {
      const bookTitle = document.createElement("p");
      bookTitle.textContent = `${book.title} by ${book.authors}`;
      bookTitle.style.cursor = "pointer";
      bookDisplayModal.appendChild(bookTitle);
    });

    bookModal.style.display = "block";

    const closeButton = document.querySelector(".close");

    closeButton.addEventListener("click", () => {
      bookModal.style.display = "";
    });
  } catch (error) {
    showToast("Error fetching books", "error");
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
        showToast("Book added successfully", "success");
      } else {
        throw new Error("Failed to add book");
      }
    } catch (error) {
      showToast("Please fill all required fields", "error");
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
      gradeLevel: document.getElementById("rentalGradeLevel").value,
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
        showToast("Rental details added successfully", "success");
      } else {
        showToast("Failed to add rental details", "error");
      }
    } catch (error) {
      showToast("Error adding rental details", "error");
    }
  });
});
