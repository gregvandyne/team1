# Web Pages Design for "LitFlix" (Team 1)
***
**Page 1**
- Title: Home
- Description/Mock-up: ![home](https://github.com/user-attachments/assets/9d9601c7-f3fa-44e5-805e-d7b1182736db)

- Required Parameters: active login session
- Necessary Data for Render: 
    User's profile information (name, avatar)
    Recent reading history (to display personalized content)
    Genre categories and book metadata from the database
    Featured books for display  
- Link Destination: /home
- List of Tests for Render:
    ✅ Page loads successfully with an active session
    ✅ Correct display of user avatar and name
    ✅ Scrollable sections for genres and featured content are present
    ✅ Display of book cover images, titles, and author names
    ✅ Clicking on a book cover redirects to the correct book detail page
    ✅ Infinite scroll or pagination works for loading more content
    ✅ Error handling when no books are available or network failure

**Page 2**
- Title: Login
- Description/Mock-up: ![login](https://github.com/user-attachments/assets/4f29b31c-6a0e-4e35-bf1d-bffa23296932)

- Required Parameters: username, password
- Necessary Data for Render:
    Login form fields (username, password)
    Error messages for failed login attempts
    Redirect URL after successful login
- Link Destination: /login
- List of Tests for Render:
    ✅ Page loads successfully
    ✅ Login form fields are visible and correctly labeled
    ✅ Error message appears for invalid username/password
    ✅ Successful login redirects to /home
    ✅ Browser maintains session after login
    ✅ Password field obscures text
    ✅ Error handling for server connection issues
    ✅ "Forgot Password" link redirects to correct recovery page

**Page 3**
- Title: My Shelf
- Description/Mock-up: ![myshelf](https://github.com/user-attachments/assets/1c6bf526-51d7-4c35-8b7f-0a6ebf2054ef) ![myshelf-widget](https://github.com/user-attachments/assets/c7b938ce-2621-49c2-9d73-a2b2abd3e7b6)


- Required Parameters: active login session
- Necessary Data for Render:
    User's saved books
    Book metadata (title, author, cover, description)
    User's reading progress
    Remove from shelf button
- Link Destination: /myshelf
- List of Tests for Render:
    ✅ Page loads successfully with an active session
    ✅ Correct display of saved books
    ✅ "Remove from Shelf" button works as intended
    ✅ Clicking on a book redirects to the book detail page
    ✅ Empty state message when no books are saved
    ✅ Reading progress bar updates correctly
    ✅ Error handling when the database fails to load data

**Page 4**
- Title: Search 
- Description/Mock-up: ![search](https://github.com/user-attachments/assets/0dba82bc-3b88-4e2f-9033-3018e3f82674) ![dynamicsearch](https://github.com/user-attachments/assets/a71160fd-2cd5-4eba-9351-78cb33bc75a3)


- Required Parameters: user input string from 'home' search bar - title or author
- Necessary Data for Render:
    Search results from the database
    Book metadata (title, author, cover)
    Pagination or infinite scroll settings
- Link Destination: /searchresults
- List of Tests for Render:
    ✅ Page loads successfully
    ✅ Search input accepts strings and submits data
    ✅ Search returns correct book results based on input
    ✅ No results state is handled gracefully
    ✅ Pagination or infinite scroll works correctly
    ✅ Clicking on a search result redirects to the correct book page
    ✅ Error handling when search service is unavailable
    ✅ Search bar retains input after page reload

**Page 5**
- Title: Featured
- Description/Mock-up: ![featured](https://github.com/user-attachments/assets/bffea5bb-477f-4ca3-b424-9d8a901fbf38)

- Required Parameters: active login session
- Necessary Data for Render:
    Featured book list from the database
    Book metadata (title, author, cover, description)
- Link Destination: /featured
- List of Tests for Render:
    ✅ Page loads successfully with an active session
    ✅ Correct display of featured books
    ✅ Clicking on a book redirects to the correct detail page
    ✅ Book cover images, titles, and author names display correctly
    ✅ Error handling when the database fails to load data
    ✅ Infinite scroll or pagination for featured lists

**Page 6**
- Title: Featured Collection
- Description/Mock-up: ![collection](https://github.com/user-attachments/assets/715a8fb5-3c9a-4b2a-bf88-68587b07e147)

- Required Parameters: active login session
- Necessary Data for Render:
    Curated list of books from the database
    Book metadata (title, author, cover, description)
- Link Destination: /collection
- List of Tests for Render:
    ✅ Page loads successfully with an active session
    ✅ Display of all books in the collection
    ✅ Filter and sort options work correctly
    ✅ Clicking on a book redirects to the correct detail page
    ✅ Correct display of book metadata
    ✅ Error handling when the database fails to load data
    ✅ Infinite scroll or pagination for large collections
    ✅ "Add to Shelf" button works as expected
