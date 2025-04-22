document.addEventListener('DOMContentLoaded', () => {
    console.log("Script Loaded Successfully!");

    // Global variables
    let currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('username');
    let selectedBook = {};

    // ------------------------------
    // Book Click → Show Modal
    // ------------------------------
    // ------------------------------
    // Book Click → Show Modal
    // ------------------------------
    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('click', function (e) {
            e.stopPropagation();

            // Get all the data from the book element
            const bookId = this.dataset.gutenbergId;
            const title = this.querySelector('.book-title')?.textContent || "";
            const author = this.querySelector('.book-author')?.textContent || "Unknown";
            const img = this.querySelector('img');
            const imageUrl = img ? img.src : "../static/placeholder_book.jpg";

            if (bookId) {
                openBookModal(
                    title,
                    author,
                    "", // genre
                    "", // description
                    imageUrl,
                    bookId,
                    0,  // download count
                    bookId ? `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt` : ""
                );
            } else {
                console.error('Book ID not found on element');
            }
        });
    });

    // ------------------------------
    // Scrollable Book Lists
    // ------------------------------
    document.querySelectorAll('.book-list').forEach(list => {
        let isDown = false, startX, scrollLeft;

        list.addEventListener('mousedown', e => {
            isDown = true;
            startX = e.pageX - list.offsetLeft;
            scrollLeft = list.scrollLeft;
        });

        ['mouseleave', 'mouseup'].forEach(event =>
            list.addEventListener(event, () => isDown = false)
        );

        list.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - list.offsetLeft;
            const walk = (x - startX) * 2;
            list.scrollLeft = scrollLeft - walk;
        });
    });

    // ------------------------------
    // Library Box Selection
    // ------------------------------
    document.querySelectorAll('.library-box').forEach(box => {
        box.addEventListener('click', function () {
            document.querySelectorAll('.library-box').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const newTitle = this.querySelector('h2')?.textContent;
            const heroTitle = document.querySelector('.hero-content h1');
            if (heroTitle && newTitle) heroTitle.textContent = newTitle;
        });
    });

    // ------------------------------
    // Search
    // ------------------------------
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('search-input');

    function performSearch() {
        const query = searchInput.value.trim();
        window.location.href = query ? `/searchPage?query=${encodeURIComponent(query)}` : `/searchPage`;
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', e => {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // ------------------------------
    // Filter Sidebar
    // ------------------------------
    const filterSidebar = document.getElementById('filter-sidebar');
    const filterToggle = document.getElementById('filter-toggle');

    if (filterSidebar && filterToggle) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('open');
            filterToggle.innerHTML = filterSidebar.classList.contains('open') ? '❮' : '❯';
        });

        window.addEventListener('click', e => {
            if (!filterSidebar.contains(e.target) && e.target !== filterToggle) {
                filterSidebar.classList.remove('open');
                filterToggle.innerHTML = '❯';
            }
        });
    }

    // ------------------------------
    // Apply Filters Button
    // ------------------------------
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
            console.log("Filters Applied:", filters);
            alert("Filters Applied! (Add logic here)");
        });
    }

    // ------------------------------
    // Load User Shelf if on myShelf
    // ------------------------------
    if (window.location.pathname.includes("myShelf")) {
        // Use the session username, not localStorage
        const username = sessionStorage.getItem('username');
        if (username) {
            loadUserShelf(username);
        }
    }

    // ------------------------------
    // Modal & Shelf Functions
    // ------------------------------
    async function loadUserShelf(username) {
        try {
            const res = await fetch(`/api/my-shelf?username=${encodeURIComponent(username)}`);
            const data = await res.json();
            const shelf = document.getElementById('shelf-books');
            if (!shelf) return console.error('Shelf container not found');

            shelf.innerHTML = '';
            if (!data.success || data.books.length === 0) {
                shelf.innerHTML = '<p>Your shelf is empty. Add some books!</p>';
                return;
            }

            data.books.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book';
                card.innerHTML = `
                    <img src="${book.bookimageurl || '/static/placeholder_book.jpg'}" alt="${book.booktitle}">
                    <div class="book-info">
                        <h3>${book.booktitle}</h3>
                        <p>Author: ${book.bookauthor}</p>
                        <p>Genre: ${book.bookgenre || '—'}</p>
                        <p>Downloads: ${book.downloadcount}</p>
                    </div>
                `;
                card.onclick = () => openBookModal(
                    book.booktitle,
                    book.bookauthor,
                    book.bookgenre,
                    book.bookdescription,
                    book.bookimageurl,
                    book.bookid,
                    book.downloadcount
                );
                shelf.appendChild(card);
            });
        } catch (err) {
            console.error('Error loading shelf:', err);
        }
    }

    // Add this function to your script.js or update the existing one
    function loadUserShelf(username) {
        if (!username) {
            console.error('No username provided to loadUserShelf');
            return;
        }

        // Option 1: Use the API endpoint
        fetch(`/api/my-shelf?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(data => {
                const shelf = document.getElementById('shelf-books');
                if (!shelf) return console.error('Shelf container not found');

                shelf.innerHTML = '';  // Clear existing books

                if (!data.success || data.books.length === 0) {
                    shelf.innerHTML = '<p>Your shelf is empty. Add some books!</p>';
                    return;
                }

                data.books.forEach(book => {
                    const card = document.createElement('div');
                    card.className = 'book';
                    card.dataset.gutenbergId = book.bookid;
                    card.innerHTML = `
                    <img src="${book.bookimageurl || '/static/placeholder_book.jpg'}" alt="${book.booktitle}">
                    <div class="book-details">
                        <h3 class="book-title">${book.booktitle}</h3>
                        <p class="book-author">${book.bookauthor}</p>
                        <p class="genre">${book.bookgenre || '—'}</p>
                    </div>
                `;

                    card.addEventListener('click', function () {
                        openBookModal(
                            book.booktitle,
                            book.bookauthor,
                            book.bookgenre || "",
                            book.bookdescription || "No description available.",
                            book.bookimageurl || "/static/placeholder_book.jpg",
                            book.bookid,
                            book.downloadcount || 0,
                            book.bookid ? `https://www.gutenberg.org/files/${book.bookid}/${book.bookid}-0.txt` : ""
                        );
                    });

                    shelf.appendChild(card);
                });
            })
            .catch(err => {
                console.error('Error loading shelf:', err);
                document.getElementById('shelf-books').innerHTML =
                    '<p>Error loading your books. Please try again later.</p>';
            });
    }

    // Update the openBookModal function to work for both regular books and shelf books
    function openBookModal(title, author, genre, description, imageUrl, bookId, downloadCount = 0, downloadUrl = '') {
        // Store the book ID for use by the add to shelf button
        document.getElementById("book-title").innerText = title;
        document.getElementById("book-author").innerText = author;

        // Check if genre element exists
        const genreElement = document.getElementById("book-genre");
        if (genreElement) genreElement.innerText = genre || "Unknown";

        document.getElementById("book-description").innerText = description || "No description available.";
        document.getElementById("book-image").src = imageUrl || "../static/placeholder_book.jpg";

        // Set up download button
        const downloadBtn = document.getElementById("download-btn");
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                if (downloadUrl) window.open(downloadUrl, '_blank');
            };
        }

        // Set up the add to shelf button
        const addToShelfBtn = document.getElementById("add-to-shelf-btn");
        if (addToShelfBtn) {
            addToShelfBtn.onclick = () => addBookToShelf(bookId);
        }

        // Show the modal
        document.getElementById("book-modal").style.display = "block";
    }


    function closeBookModal() {
        const modal = document.getElementById('book-modal') || document.getElementById('shelf-modal');
        if (modal) modal.style.display = 'none';
    }

    async function addBookToShelf(bookId) {
        if (!bookId) {
            console.error("No book ID available");
            alert("Error: No book selected");
            return;
        }

        try {
            const res = await fetch('/addToShelf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ book_id: bookId })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Book added to your shelf!');
                closeBookModal();
            } else {
                alert(data.message || 'Failed to add book to shelf');
            }
        } catch (err) {
            console.error('Add error:', err);
            alert('Error adding book to shelf');
        }
    }

    async function removeBookFromShelf(bookId) {
        try {
            const res = await fetch('/api/remove-from-shelf', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId })
            });

            const data = await res.json();
            if (data.success) {
                alert('Book removed');
                closeBookModal();
                // Use session username
                const username = sessionStorage.getItem('username');
                if (username) {
                    loadUserShelf(username);
                }
            } else {
                alert(data.message || 'Failed to remove');
            }
        } catch (err) {
            console.error('Remove error:', err);
            alert('Error removing book');
        }
    }

    // Global exposure
    window.openBookModal = openBookModal;
    window.closeBookModal = closeBookModal;
    window.addBookToShelf = addBookToShelf;
});
