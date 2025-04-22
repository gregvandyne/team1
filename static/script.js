document.addEventListener('DOMContentLoaded', () => {
    console.log("Script Loaded Successfully!");

    // Global variables
    let currentUser = localStorage.getItem('currentUser');
    let selectedBook = {};

    // ------------------------------
    // Book Click → Show Modal
    // ------------------------------
    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('click', async function (e) {
            e.stopPropagation();
            const bookId = this.dataset.bookId;

            if (!bookId) return console.error('Missing book ID');

            const modal = document.getElementById('book-modal');
            if (!modal) return console.error('Modal not found');

            modal.style.display = 'block';

            try {
                const res = await fetch(`/api/books/${bookId}`);
                const book = await res.json();

                openBookModal(
                    book.title,
                    book.author,
                    book.genre,
                    book.description,
                    book.cover_image_url,
                    book.id,
                    book.download_count,
                    book.download_url
                );
            } catch (err) {
                console.error('Fetch failed:', err);
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
    if (window.location.pathname.includes("myShelf") && currentUser) {
        loadUserShelf(currentUser);
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

    function openBookModal(title, author, genre, description, imageUrl, id = null, downloadCount = 0, downloadUrl = null) {
        selectedBook = { title, author, genre, description, imageUrl, id, downloadCount, downloadUrl };

        document.getElementById('book-title').textContent = title;
        document.getElementById('book-author').textContent = author;
        document.getElementById('book-description').textContent = description || 'No description available.';
        document.getElementById('book-image').src = imageUrl;

        const modal = document.getElementById('book-modal');
        if (modal) modal.style.display = 'flex';

        const downloadBtn = modal.querySelector('#download-btn');
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                if (downloadUrl) window.open(downloadUrl, '_blank');
                else alert("Download not available.");
            };
        }

        const addBtn = document.getElementById('add-to-shelf-btn');
        const removeBtn = document.getElementById('remove-from-shelf');

        if (addBtn) addBtn.onclick = () => addBookToShelf(id);
        if (removeBtn) removeBtn.onclick = () => removeBookFromShelf(id);
    }

    function closeBookModal() {
        const modal = document.getElementById('book-modal') || document.getElementById('shelf-modal');
        if (modal) modal.style.display = 'none';
    }

    async function addBookToShelf(bookId) {
        if (!currentUser) return alert('Please log in to add books.');

        try {
            const res = await fetch('/api/add-to-shelf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUser, bookId })
            });

            const data = await res.json();
            if (data.success) {
                alert('Book added!');
                closeBookModal();
            } else {
                alert(data.message || 'Failed to add book');
            }
        } catch (err) {
            console.error('Add error:', err);
            alert('Error adding book');
        }
    }

    async function removeBookFromShelf(bookId) {
        if (!currentUser) return alert('Please log in to manage your shelf.');

        try {
            const res = await fetch('/api/remove-from-shelf', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUser, bookId })
            });

            const data = await res.json();
            if (data.success) {
                alert('Book removed');
                closeBookModal();
                loadUserShelf(currentUser);
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
});

