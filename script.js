// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to books
    const books = document.querySelectorAll('.book');
    books.forEach(book => {
        book.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        book.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Implement horizontal scrolling for book lists
    const bookLists = document.querySelectorAll('.book-list');
    bookLists.forEach(list => {
        let isDown = false;
        let startX;
        let scrollLeft;

        list.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - list.offsetLeft;
            scrollLeft = list.scrollLeft;
        });

        list.addEventListener('mouseleave', () => {
            isDown = false;
        });

        list.addEventListener('mouseup', () => {
            isDown = false;
        });

        list.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - list.offsetLeft;
            const walk = (x - startX) * 2;
            list.scrollLeft = scrollLeft - walk;
        });
    });

    // Add functionality to library boxes
    const libraryBoxes = document.querySelectorAll('.library-box');
    libraryBoxes.forEach(box => {
        box.addEventListener('click', function() {
            libraryBoxes.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Here you would typically update the hero content based on the selected box
            document.querySelector('.hero-content h1').textContent = this.querySelector('h2').textContent;
        });
    });
});