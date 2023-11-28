document.addEventListener("DOMContentLoaded", async () => {
  try {
    const rentalData = await fetchRentalDetails();
    if (rentalData.length > 0) {
      const rentalTable = createRentalTable(rentalData);
      displayRentalTable(rentalTable);
    } else {
      displayNoRentalDataMessage();
    }
  } catch (error) {
    console.error("Error fetching and displaying rental details:", error);
  }
});

function displayNoRentalDataMessage() {
  const noDataMessage = document.createElement("p");
  noDataMessage.textContent = "No rental data available.";
  noDataMessage.classList.add("no-data-message");
  
  const rentalTableContainer = document.getElementById("table-container");
  rentalTableContainer.appendChild(noDataMessage);
}

async function fetchRentalDetails() {
  const response = await fetch("http://localhost:3000/rental-details");
  if (!response.ok) {
    throw new Error("Failed to fetch rental details");
  }
  const { data } = await response.json();
  return data;
}

function createRentalTable(rentalData) {
  const rentalTable = document.createElement("table");
  rentalTable.classList.add("modern-table");
  rentalTable.id = "rentalTable";

  const tableHead = createTableHead();
  const tableBody = createTableBody(rentalData);

  rentalTable.appendChild(tableHead);
  rentalTable.appendChild(tableBody);

  return rentalTable;
}

function createTableHead() {
  const tableHead = document.createElement("thead");
  const tableRow = document.createElement("tr");
  const tableHeaders = ["Student Name", "School ID", "Contact", "Due Date"];

  tableHeaders.forEach((header) => {
    const tableHeader = document.createElement("th");
    tableHeader.textContent = header;
    tableRow.appendChild(tableHeader);
  });

  tableHead.appendChild(tableRow);
  return tableHead;
}

function createTableBody(rentalData) {
  const tableBody = document.createElement("tbody");

  rentalData.forEach((rentalDetail) => {
    const row = createTableRow(rentalDetail);
    tableBody.appendChild(row);
  });

  return tableBody;
}

function createTableRow(rentalDetail) {
  const row = document.createElement("tr");

  const cells = ["studentName", "schoolID", "contact", "dueDate"];
  cells.forEach((cell) => {
    const cellData = (cell === "dueDate") ?
      new Date(rentalDetail[cell]).toLocaleDateString() :
      rentalDetail[cell];

    const tableCell = document.createElement("td");
    tableCell.textContent = cellData;
    row.appendChild(tableCell);
  });

  const removalCell = createRemovalCell(rentalDetail);
  row.appendChild(removalCell);

  return row;
}

const calculateFine = (date) => {

  console.log(date)
  const currentDate = new Date();
  const dueDate = new Date(date);
  console.log(currentDate,dueDate)

  if (currentDate > dueDate) {
    const timeDiff = currentDate.getTime() - dueDate.getTime();
    const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate days overdue
    const fine = daysOverdue * 50; // Calculate fine at 20% per overdue day
    return `$${fine.toString()}`; // Return fine as a string
  } else {
    return "-"; // Book is not overdue
  }
};


function createRemovalCell(rentalDetail) {
  const removalCell = document.createElement("td");
  const removalBtn = document.createElement("button");
  removalBtn.classList.add("sm-blue-btn");
  removalCell.appendChild(removalBtn);
 
  const calculatedFine = calculateFine(rentalDetail.dueDate)

  removalBtn.textContent = (calculatedFine == "-" ? 'Return' : `Return & pay ${calculateFine(rentalDetail.dueDate)} `)

    
  removalBtn.classList.add(calculatedFine == "-" ? "sm-blue-btn" : "sm-red-btn" );
  
  removalBtn.addEventListener("click", async () => {
    try {
      const rentalID = rentalDetail._id;
      const endpoint = `http://localhost:3000/book-returns/${rentalID}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookToRemove: "Some Book Title" }),
      });

      if (response.ok) {
        removalCell.parentElement.remove();
        console.log("Book removed successfully");
        window.location.reload()
      } else {
        console.error("Failed to remove book");
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  });

  return removalCell;
}

function displayRentalTable(rentalTable) {
  const rentalTableContainer = document.getElementById("table-container");
  rentalTableContainer.appendChild(rentalTable);
}
