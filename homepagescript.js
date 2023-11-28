document.addEventListener('DOMContentLoaded', function () {
    
    const StudentPage = document.getElementById('StudentPage');
    const BookPage= document.getElementById('BookPage');
    const RentalPage = document.getElementById('RentalPage');

    
    StudentPage.addEventListener('click', function () {
       // window.location.href="What ever the student page index is"
       console.log("Student page");
    });

    BookPage.addEventListener('click', function () {
       // window.location.href="What ever the Book page index is"
       console.log("Book page");
    });

    RentalPage.addEventListener('click', function () {
       // window.location.href="What ever the Rentalpage index is"
       console.log("Rental page");
    });
});