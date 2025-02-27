document.addEventListener('DOMContentLoaded', function () {
    // Book Hover Effect
    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('mouseenter', () => book.style.transform = 'scale(1.05)');
        book.addEventListener('mouseleave', () => book.style.transform = 'scale(1)');
    });

    // Horizontal Scrolling for Book Lists
    document.querySelectorAll('.book-list').forEach(list => {
        let isDown = false, startX, scrollLeft;

        list.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - list.offsetLeft;
            scrollLeft = list.scrollLeft;
        });

        list.addEventListener('mouseleave', () => isDown = false);
        list.addEventListener('mouseup', () => isDown = false);

        list.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            list.scrollLeft = scrollLeft - (e.pageX - list.offsetLeft - startX) * 2;
        });
    });

    // Library Box Selection
    document.querySelectorAll('.library-box').forEach(box => {
        box.addEventListener('click', function () {
            document.querySelectorAll('.library-box').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelector('.hero-content h1').textContent = this.querySelector('h2').textContent;
        });
    });

    // Modal Functionality
    const modal = document.getElementById('book-modal');
    const closeModal = () => modal.style.display = 'none';

    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('click', function () {
            document.getElementById('book-image').src = this.querySelector('img').src;
            document.getElementById('book-title').textContent = this.querySelector('p').textContent;
            document.getElementById('book-author').textContent = "Author Name"; // Replace with real data
            document.getElementById('book-genre').textContent = "Genre"; // Replace with real data
            document.getElementById('book-description').textContent = "This is a sample book description."; // Replace with real data
            modal.style.display = 'block';
        });
    });

    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
});
