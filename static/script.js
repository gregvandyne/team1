// static/script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script Loaded Successfully!");

    // Book Hover Effect
    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('click', async function (e) {
            e.stopPropagation();
            const bookId = this.dataset.bookId || "1"; //  to test ID
            console.log('Book ID:', bookId); 

            if (!bookId) {
                console.error('Book ID is missing.');
                return;
            }

            const modal = document.getElementById('book-modal');
            if (!modal) {
                console.error('Modal element not found');
                return;
            }
            
            modal.style.display = 'block';

            try {
                // Corrected fetch URL with the bookId parameter
                const response = await fetch(`/api/books/${bookId}`);
                const bookData = await response.json();

                document.getElementById('book-image').src = bookData.cover_image_url;
                document.getElementById('book-title').textContent = bookData.title;
                document.getElementById('book-author').textContent = bookData.author;
                document.getElementById('book-genre').textContent = bookData.genre;
                document.getElementById('book-description').textContent = bookData.description;
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

    // Function to close modal
    const closeModal = (modal) => {
        if (modal) modal.style.display = 'none';
    };

    // Attach close event listeners for both modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            if (bookModal) closeModal(bookModal);
            if (shelfModal) closeModal(shelfModal);
        });
    });
    
    // Close specific modals with their buttons
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (bookModal) closeModal(bookModal);
        });
    }
    
    const closeShelfModalBtn = document.getElementById('close-shelf-modal');
    if (closeShelfModalBtn) {
        closeShelfModalBtn.addEventListener('click', () => {
            if (shelfModal) closeModal(shelfModal);
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (bookModal && e.target === bookModal) closeModal(bookModal);
        if (shelfModal && e.target === shelfModal) closeModal(shelfModal);
    });

    // Search Button Navigation
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    // Handle form submission
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission
            console.log("Search form submitted");

            const query = searchInput.value.trim();
            const url = query ? `/searchPage?q=${encodeURIComponent(query)}` : '/searchPage';
            console.log("Redirecting to: ", url);  // Check the redirect URL
            window.location.href = url;  // Redirect to the search results page
        });
    } else {
        console.log("searchForm or searchInput not found on this page.");
    }

    // Filter Sidebar Toggle
    const filterSidebar = document.getElementById('filter-sidebar');
    const filterToggle = document.getElementById('filter-toggle');

    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('open');
            filterToggle.innerHTML = filterSidebar.classList.contains('open') ? '❮' : '❯'; 
        });

        // Close sidebar when clicking outside
        window.addEventListener('click', (event) => {
            if (!filterSidebar.contains(event.target) && event.target !== filterToggle) {
                filterSidebar.classList.remove('open');
                filterToggle.innerHTML = '❯'; 
            }
        });
    }

    // Apply Filters
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const filters = {
                genre: document.getElementById('genre-filter')?.value.trim() || '',
                author: document.getElementById('author-filter')?.value.trim() || '',
                rating: document.getElementById('rating-filter')?.value || '',
                year: document.getElementById('year-filter')?.value.trim() || '',
                format: document.getElementById('format-filter')?.value || ''
            };

            console.log(`Filters Applied:`, filters);
            
            try {
                // Build the query string from filters
                const searchParams = new URLSearchParams();
                
                // Add the current search query if it exists
                const currentQuery = new URLSearchParams(window.location.search).get('q');
                if (currentQuery) searchParams.append('q', currentQuery);
                
                // Add all non-empty filters
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) searchParams.append(key, value);
                });
                
                // Redirect to the search page with filters
                window.location.href = `/searchPage?${searchParams.toString()}`;
            } catch (error) {
                console.error('Error applying filters:', error);
                alert('There was an error applying filters. Please try again.');
            }
        });
    }
    
    // Reset Filters
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            // Clear all filter inputs
            const genreFilter = document.getElementById('genre-filter');
            const authorFilter = document.getElementById('author-filter');
            const ratingFilter = document.getElementById('rating-filter');
            const yearFilter = document.getElementById('year-filter');
            const formatFilter = document.getElementById('format-filter');
            
            if (genreFilter) genreFilter.value = '';
            if (authorFilter) authorFilter.value = '';
            if (ratingFilter) ratingFilter.value = '';
            if (yearFilter) yearFilter.value = '';
            if (formatFilter) formatFilter.value = '';
            
            // Keep only the search query parameter
            const searchQuery = new URLSearchParams(window.location.search).get('q');
            window.location.href = searchQuery ? `/searchPage?q=${encodeURIComponent(searchQuery)}` : '/searchPage';
        });
    }
});

// Function to navigate to different pages 
function navigateTo(page) {
    window.location.href = page;
}
