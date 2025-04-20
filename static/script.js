document.addEventListener('DOMContentLoaded', () => {
    // Book Hover Effect
    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('click', async function (e) {
            e.stopPropagation(); // Prevent unintended triggers

            const isShelfPage = document.getElementById('shelf-books') !== null; //check if yout on myShelf page or not
            const bookId = this.dataset.bookId; // Assume each book div has a `data-id` attribute with the book's ID
            //const modal = document.getElementById('book-modal'); // or shelfModal depending on the page
            const modal = isShelfPage ? shelfModal : bookModal; //use shelfMondal of on myShelf page, bookModal if not
            const prefix = isShelfPage ? 'shelf' : 'book';

            if (!modal) return;

            modal.style.display = 'block';
            try {
            // Fetch real data about the book from the server
                const response = await fetch(`/book/${bookId}`);
                const bookData = await response.json();

                // Update the modal with real data
                document.getElementById('${prefix}-book-image').src = bookData.imageUrl;
                document.getElementById('${prefix}-book-title').textContent = bookData.title;
                document.getElementById('${prefix}-book-author').textContent = bookData.author;
                document.getElementById('${prefix}-book-genre').textContent = bookData.genre;
                document.getElementById('${prefix}-book-description').textContent = bookData.description;
            } catch (error) {
            console.error('Error fetching book data:', error);
            }   
        });
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

            const newTitle = this.querySelector('h2').textContent;
            const heroTitle = document.querySelector('.hero-content h1');

            if (heroTitle) {
                heroTitle.textContent = newTitle;
            } else {
                console.error('Could not find .hero-content h1');
            }
        });
    });

    // Ensure modals are hidden initially
    const bookModal = document.getElementById('book-modal');
    const shelfModal = document.getElementById('shelf-modal');

    if (bookModal) bookModal.style.display = 'none';
    if (shelfModal) shelfModal.style.display = 'none';

    // Function to open the correct modal when a book is clicked
    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent unintended triggers

            const isShelfPage = document.getElementById('shelf-books') !== null; // Detect if on My Shelf page
            const modal = isShelfPage ? shelfModal : bookModal;
            if (!modal) return;

            modal.style.display = 'block';

            // Determine which modal content to update
            const prefix = isShelfPage ? 'shelf' : 'book';

            document.getElementById(`${prefix}-book-image`).src = this.querySelector('img').src;
            document.getElementById(`${prefix}-book-title`).textContent = this.querySelector('p').textContent;
            document.getElementById(`${prefix}-book-author`).textContent = "Author Name"; // Replace with real data
            document.getElementById(`${prefix}-book-genre`).textContent = "Genre"; // Replace with real data
            document.getElementById(`${prefix}-book-description`).textContent = "This is a sample book description."; // Replace with real data
        });
    });

    // Function to close modal
    const closeModal = (modal) => {
        if (modal) modal.style.display = 'none';
    };

    // Attach close event listeners for both modals
    document.getElementById('close-modal')?.addEventListener('click', () => closeModal(bookModal));
    document.getElementById('close-shelf-modal')?.addEventListener('click', () => closeModal(shelfModal));
    document.querySelectorAll('.close').forEach(closeBtn =>
        closeBtn.addEventListener('click', () => {
            closeModal(bookModal);
            closeModal(shelfModal);
        })
    );

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookModal) closeModal(bookModal);
        if (e.target === shelfModal) closeModal(shelfModal);
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
});

// Function to navigate to different pages 
function navigateTo(page) {
    window.location.href = page;
}
