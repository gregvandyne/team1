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

// Global variable to store current user
let currentUser = null;

// Set current user after login
function setCurrentUser(username) {
    currentUser = username;
    localStorage.setItem('currentUser', username);
}

// Get current user from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    currentUser = localStorage.getItem('currentUser');
    
    // If we're on the myShelf page and a user is logged in, load their books
    if (window.location.pathname.includes('myShelf') && currentUser) {
        loadUserShelf(currentUser);
    }
});

// Function to load user's shelf
async function loadUserShelf(username) {
  try {
    const resp = await fetch(`/api/my-shelf?username=${encodeURIComponent(username)}`);
    const data = await resp.json();
    const shelf = document.getElementById('shelf-books');
    
    if (!shelf) {
      console.error('Shelf element not found');
      return;
    }
    
    shelf.innerHTML = ''; // clear placeholders

    if (!data.success || data.books.length === 0) {
      shelf.innerHTML = '<p>Your shelf is empty. Add some books!</p>';
      return;
    }

    data.books.forEach(book => {
      // 1) Book container
      const card = document.createElement('div');
      card.className = 'book';

      // 2) Cover image
      const img = document.createElement('img');
      img.src = book.bookimageurl || '/static/placeholder_book.jpg';
      img.alt = book.booktitle;
      card.appendChild(img);

      // 3) Info block under cover
      const info = document.createElement('div');
      info.className = 'book-info';
      info.innerHTML = `
        <h3>${book.booktitle}</h3>
        <p>Author: ${book.bookauthor}</p>
        <p>Genre: ${book.bookgenre || '—'}</p>
        <p>Downloads: ${book.downloadcount}</p>
      `;
      card.appendChild(info);

      // 4) Click → open modal, pass downloadCount
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
  } catch (e) {
    console.error('loadUserShelf error', e);
  }
}

// Comprehensive openBookModal function that handles all use cases
function openBookModal(title, author, genre, description = "No description available.", imageSrc = "", bookId = null, downloads = 0) {
    const modal = document.getElementById('shelf-modal') || document.getElementById('book-modal');
    if (modal) {
        const imgEl = modal.querySelector('.modal-book-img') || modal.querySelector('#book-image');
        const titleEl = modal.querySelector('#shelf-book-title') || modal.querySelector('#book-title');
        const authorEl = modal.querySelector('#shelf-book-author') || modal.querySelector('#book-author');
        const genreEl = modal.querySelector('#shelf-book-genre') || modal.querySelector('#book-genre');
        const descEl = modal.querySelector('#shelf-book-description') || modal.querySelector('#book-description');
        const dlEl = modal.querySelector('#shelf-book-downloads');

        if (imgEl) imgEl.src = imageSrc || '/static/placeholder_book.jpg';
        if (titleEl) titleEl.textContent = title;
        if (authorEl) authorEl.textContent = author;
        if (genreEl) genreEl.textContent = genre;
        if (descEl) descEl.textContent = description;
        if (dlEl) dlEl.textContent = downloads;
        
        // Store the book ID as a data attribute on the modal
        if (bookId) modal.dataset.bookId = bookId;

        // Set up the download button
        const downloadBtn = modal.querySelector('#download-btn');
        if (downloadBtn && bookId) {
            downloadBtn.onclick = async () => {
                try {
                    await fetch('/api/increment-download', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bookId })
                    });
                    alert('Download started!');
                    // update counter in UI
                    if (dlEl) dlEl.textContent = parseInt(dlEl.textContent) + 1;
                } catch(err) {
                    console.error('Download error:', err);
                    alert('Failed to bump download count');
                }
            };
        }
        
        // Set up the Add to Shelf button
        const addToShelfBtn = document.getElementById('add-to-shelf-btn');
        if (addToShelfBtn && bookId) {
            addToShelfBtn.onclick = () => addBookToShelf(bookId);
        }
        
        // Set up the Remove from Shelf button
        const removeFromShelfBtn = document.getElementById('remove-from-shelf');
        if (removeFromShelfBtn && bookId) {
            removeFromShelfBtn.onclick = () => removeBookFromShelf(bookId);
        }

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

// Function to add a book to the user's shelf
async function addBookToShelf(bookId) {
    if (!currentUser) {
        alert('Please log in to add books to your shelf');
        return;
    }
    
    try {
        const response = await fetch('/api/add-to-shelf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser, bookId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Book added to your shelf!');
            closeBookModal();
        } else {
            alert(data.message || 'Failed to add book to shelf');
        }
    } catch (error) {
        console.error('Error adding book to shelf:', error);
        alert('An error occurred while adding the book to your shelf');
    }
}

// Function to remove a book from the user's shelf
async function removeBookFromShelf(bookId) {
    if (!currentUser) {
        alert('Please log in to manage your shelf');
        return;
    }
    
    try {
        const response = await fetch('/api/remove-from-shelf', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser, bookId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Book removed from your shelf');
            closeBookModal();
            // Reload the shelf to reflect the change
            loadUserShelf(currentUser);
        } else {
            alert(data.message || 'Failed to remove book from shelf');
        }
    } catch (error) {
        console.error('Error removing book from shelf:', error);
        alert('An error occurred while removing the book from your shelf');
    }
}
