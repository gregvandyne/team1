document.addEventListener('DOMContentLoaded', () => {
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

        ['mouseleave', 'mouseup'].forEach(event => list.addEventListener(event, () => isDown = false));

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

    // Search Button Navigation
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    searchBtn?.addEventListener('click', () => {
        const query = searchInput?.value.trim();
        window.location.href = query
            ? `searchPage.html?query=${encodeURIComponent(query)}`
            : 'searchPage.html';
    });

    // Filter Sidebar Toggle
    const filterSidebar = document.getElementById('filter-sidebar');
    const filterToggle = document.getElementById('filter-toggle');

    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('open');
            filterToggle.innerHTML = filterSidebar.classList.contains('open') ? '❮' : '❯'; // Change icon direction
        });

        // Close sidebar when clicking outside
        window.addEventListener('click', (event) => {
            if (!filterSidebar.contains(event.target) && event.target !== filterToggle) {
                filterSidebar.classList.remove('open');
                filterToggle.innerHTML = '❯'; // Reset icon
            }
        });
    }

    // Apply Filters (Example)
    document.getElementById('apply-filters')?.addEventListener('click', () => {
        const filters = {
            genre: document.getElementById('genre-filter')?.value,
            author: document.getElementById('author-filter')?.value.trim(),
            rating: document.getElementById('rating-filter')?.value,
            year: document.getElementById('year-filter')?.value,
            format: document.getElementById('format-filter')?.value
        };

        console.log(`Filters Applied:`, filters);
        alert('Filters Applied! (Functionality can be added here)');
    });

    // Function to open the book modal
    function openBookModal(title, author, genre, description = "No description available.", imageSrc = "") {
        const modal = document.getElementById('shelf-modal') || document.getElementById('book-modal');
        if (modal) {
            const modalImage = modal.querySelector('.modal-book-img');
            const modalTitle = modal.querySelector('#shelf-book-title') || modal.querySelector('#book-title');
            const modalAuthor = modal.querySelector('#shelf-book-author') || modal.querySelector('#book-author');
            const modalGenre = modal.querySelector('#shelf-book-genre') || modal.querySelector('#book-genre');
            const modalDescription = modal.querySelector('#shelf-book-description') || modal.querySelector('#book-description');

            // Populate modal with book details
            if (modalImage) modalImage.src = imageSrc;
            if (modalTitle) modalTitle.textContent = title;
            if (modalAuthor) modalAuthor.textContent = author;
            if (modalGenre) modalGenre.textContent = genre;
            if (modalDescription) modalDescription.textContent = description;

            // Display the modal
            modal.style.display = 'flex';
        }
    }

    // Function to close the book modal
    function closeBookModal() {
        const modal = document.getElementById('shelf-modal') || document.getElementById('book-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('shelf-modal') || document.getElementById('book-modal');
        if (modal && e.target === modal) {
            closeBookModal();
        }
    });

    // Attach modal functions to global scope for inline `onclick` attributes
    window.openBookModal = openBookModal;
    window.closeBookModal = closeBookModal;
});

// Function to navigate to different pages 
function navigateTo(page) {
    window.location.href = page;
}
