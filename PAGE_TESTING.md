# Web Pages Design for "LitFlix" (Team 1)
***
## Page 1
- **Title:** Home
- **Mock-up:** ![home](https://github.com/user-attachments/assets/9d9601c7-f3fa-44e5-805e-d7b1182736db)
- **Description:** 
    The Home page serves as the main dashboard for users after they log in. It provides a personalized e-library experience similar to popular video streaming services by displaying the user's recent reading history, a variety of book genres, and featured books/collections. The page is designed to be visually appealing and easy to navigate, with side-scrollable sections for different genres and featured content. Users can click on book covers to be redirected to the correct book detail page. The page also supports infinite scroll or pagination to load more content as the user scrolls down. 

- **Required Parameters:** 
    - Active login session
- **Necessary Data for Render:** 
    - User's profile information (name, avatar, email address, account creation date, preferences)
    - Recent reading history (book ids, time stamps, reading progress percentages, last page read)
    - Genre categories and book metadata from the database (genre IDs, names, descriptions, associated book counts)
    - Featured books for display (book IDs, titles, authors, cover images, publication dates, ratings, page counts)
    - Recommendation algorithm data (user behavior patterns, popular books in user's preferred genres)
    - Session authentication tokens and expiration information
    - UI state preferences (dark/light mode, font size, layout preferences) 
- **Link Destination:** /home
- **List of Tests for Render:**
    ✅ Page loads successfully with an active session
    ✅ Correct display of user avatar and name
    ✅ Scrollable sections for genres and featured content are present
    ✅ Display of book cover images, titles, and author names
    ✅ Clicking on a book cover redirects to the correct book detail page
    ✅ Infinite scroll or pagination works for loading more content
    ✅ Error handling when no books are available or network failure
- **Django Database Tests:**
    ✅ Test User model retrieval with correct profile data
    ✅ Test ReadingHistory model for accurate storage and retrieval of reading progress
    ✅ Test Book and Genre models relationships with QuerySet annotations
    ✅ Test database query performance with Django debug toolbar
    ✅ Test database transaction atomicity when updating reading history
    ✅ Test Django signals for updating recommendation data when user interacts with books
    ✅ Test database migrations with Django's migration testing framework
    ✅ Test model managers for custom querysets like "get_recommended_books"

## Page 2
- **Title:** Login
- **Mock-up:** ![updated_login](https://github.com/user-attachments/assets/6f5a1493-b25f-4abd-9a45-9eafcd42c173)

- **Description:** 
    The Login page allows users to access their accounts by entering their username and password. It is designed to be visually modern and user-friendly. The page includes fields for username and password, and provides error messages for failed login attempts. Upon successful login, users are redirected to the Home page. Upon a failed login attempt, the page pops up with a "Forgot Password" link that redirects users to the password recovery page.
- **Required Parameters:** 
    - User input of valid username and password
- **Necessary Data for Render:**
    - Login form fields (username, password)
    - Error messages for failed login attempts
    - Redirect URL after successful login
    - CSRF token for form security
    - Authentication backend configuration
    - Password validation rules
    - Session cookie settings and expiration
    - Login attempt tracking data (for lockout after multiple failures)
    - OAuth provider information (if supporting social login)
    - Remember me cookie settings

- **Link Destination:** /login
- **List of Tests for Render:**
    ✅ Page loads successfully
    ✅ Login form fields are visible and correctly labeled
    ✅ Error message appears for invalid username/password
    ✅ Successful login redirects to /home
    ✅ Browser maintains session after login
    ✅ Password field obscures text
    ✅ Error handling for server connection issues
    ✅ "Forgot Password" link redirects to correct recovery page
- **Django Database Tests:**
    ✅ Test User model authentication with Django's auth system
    ✅ Test failed login attempts tracking in database
    ✅ Test session creation and storage in Django's session backend
    ✅ Test password hashing and verification
    ✅ Test Django's authentication middleware
    ✅ Test login view with Django's RequestFactory and TestCase
    ✅ Test database queries optimization with select_related
    ✅ Test custom authentication backends if implemented

## Page 3
- **Title:** My Shelf
- **Mock-up:** ![myshelf](https://github.com/user-attachments/assets/1c6bf526-51d7-4c35-8b7f-0a6ebf2054ef) ![updated_myshelf_widget](https://github.com/user-attachments/assets/a9d786d1-b4f2-400a-b708-7b291b180d51)

- **Description:**
    The My Shelf page allows users to view and manage their personalized collection of saved books. The page displays the book covers in a grid layout. When a user clicks on a book, a panel pops up with detailed information about the book, including author details, publication information, and a "Read Now" button that allows the user to start reading the book immediately. The page also includes a "Remove from Shelf" button for each book, allowing users to manage their collection easily.
- **Required Parameters:** 
    - Active login session
    - User clicks on 'My Shelf' button on Navigation bar
    - User clicks on book cover image (for book pop-up widget)
- **Necessary Data for Render:**
    - User's saved books (book IDs, date added to shelf, custom user notes)
    - Book metadata (title, author, cover, description, ISBN, publication date, publisher)
    - User's reading progress (percentage complete, last page read, time spent reading, bookmarks)
    - Book categorization data (user-defined tags, collections, reading priority)
    - Shelf organization preferences (sort order, view type, filter settings)
    - Book availability information (download status, offline availability)
    - Book format information (PDF, EPUB, etc.)
    - User annotations and highlights
    - Reading statistics (books completed, pages read, reading streaks)
- **Link Destination:** /myShelf
- **List of Tests for Render:**
    ✅ Page loads successfully with an active session
    ✅ Correct display of saved books
    ✅ "Remove from Shelf" button works as intended
    ✅ Clicking on a book redirects to the book detail page
    ✅ Empty state message when no books are saved
    ✅ Reading progress bar updates correctly
    ✅ Error handling when the database fails to load data
- **Django Database Tests:**
    ✅ Test UserShelf model with M2M relationships to Book model
    ✅ Test database operations for adding/removing books from shelf
    ✅ Test Django ORM annotations for calculating reading progress
    ✅ Test database transaction integrity when updating multiple related models
    ✅ Test prefetch_related optimization for book collections
    ✅ Test Django signals for updating shelf statistics when books are added/removed
    ✅ Test database constraints and validation for shelf limits
    ✅ Test model methods for shelf organization and filtering
    ✅ Test Django's cache framework for frequently accessed shelf data

## Page 4
- **Title:** Search 
- **Mock-up:** ![search](https://github.com/user-attachments/assets/0dba82bc-3b88-4e2f-9033-3018e3f82674) ![dynamicsearch](https://github.com/user-attachments/assets/a71160fd-2cd5-4eba-9351-78cb33bc75a3)
- **Description:**
    The Search Results page allows users to find books based on their search queries. Users can search by title, author, or genre in the search field on the Navigation bar. The search results are displayed as a list with book covers, titles, authors, and a short plot blurb. Users can click on a book cover to add a book to their shelf directly from the search results. The page also features an advanced search filter, which is a draggable pop-out on the left side, allowing users to refine their search results based on various criteria such as publication date, genre, and other attributes.
- **Required Parameters:** 
    - User input string from 'home' search bar - title, author, or genre
    - Additional input into 'Advanced Search' field (for a new, filtered query)
- **Necessary Data for Render:**
    - Search results from the database (relevance scores, match highlights)
    - Book metadata (title, author, cover, genre, publication date, ISBN, page count)
    - Pagination or infinite scroll settings (items per page, current page, total results)
    - Search history for the user (recent searches, saved searches)
    - Advanced filter options (genre list, publication year range, language options)
    - Search index status and last update timestamp
    - Related search suggestions
    - User's shelf data (to indicate which books are already saved)
    - Search analytics data (popular searches, trending books)
    - Faceted search aggregations (count of books per genre, author, etc.)

- **Link Destination:** /searchPage
- **List of Tests for Render:**
    ✅ Page loads successfully
    ✅ Search input accepts strings and submits data
    ✅ Search returns correct book results based on input
    ✅ No results state is handled gracefully
    ✅ Pagination or infinite scroll works correctly
    ✅ Clicking on a search result redirects to the correct book page
    ✅ Error handling when search service is unavailable
    ✅ Advanced search filter pop-out works correctly
    ✅ Search bar retains input after page reload
    ✅ "Add to Shelf" button works as intended
- **Django Database Tests:**
    ✅ Test Django's Q objects for complex search queries
    ✅ Test full-text search capabilities with PostgreSQL and Django
    ✅ Test search query performance with different indexing strategies
    ✅ Test Django ORM's select_related and prefetch_related for optimized search results
    ✅ Test transaction isolation when updating search history
    ✅ Test database triggers for updating search relevance data
    ✅ Test Django's aggregation functions for faceted search
    ✅ Test database connection pooling under high search load
    ✅ Test Django signals for logging search analytics
    ✅ Test custom model managers for specialized search functionality

## Page 5
- **Title:** Featured
- **Mock-up:** ![featured](https://github.com/user-attachments/assets/bffea5bb-477f-4ca3-b424-9d8a901fbf38)
- **Description:**
    The Featured page highlights a featured author and a featured collection. The featured author section includes an image of the author, a brief biography, and a list of their other works. Users can click on 'Read Other Works' to be directed to a search results page displaying the author's other works. The featured collection section showcases a curated list of books, which users can click into to view as a separate page.
- **Required Parameters:** 
    - Active login session
- **Necessary Data for Render:**
    - Featured collection book list from the database (collection ID, title, description, curator)
    - Featured author information (author ID, name, image, bio, birth date, nationality, awards)
    - Author's complete bibliography (book IDs, titles, publication dates, genres)
    - Book metadata (title, author, cover, description, rating, review count)
    - Collection curation data (selection criteria, date featured, curator notes)
    - Featured content scheduling information (start/end dates for featured status)
    - Related authors and collections
    - User interaction data with featured content (views, clicks, conversions)
    - Editorial content (interviews, articles about featured author)
    - Promotional content (special offers on featured books)
- **Link Destination:** /featured
- **List of Tests for Render:**
    ✅ Page loads successfully with an active session
    ✅ Correct display of featured collection
    ✅ Correct display of featured author information
    ✅ Clicking on a book redirects to the correct detail page
    ✅ 'Read Other Works' link redirects to the correct search results page
    ✅ 'See the Collection' link redirects to the correct 'featured collection' page
    ✅ Book cover images, titles, and author names display correctly
    ✅ Error handling when the database fails to load data
    ✅ Infinite scroll or pagination for featured lists
- **Django Database Tests:**
    ✅ Test FeaturedAuthor and FeaturedCollection models
    ✅ Test database queries for retrieving featured content with select_related
    ✅ Test Django admin customization for managing featured content
    ✅ Test database constraints for featured content scheduling
    ✅ Test Django's caching framework for featured content
    ✅ Test database triggers for rotating featured content
    ✅ Test model methods for determining related content
    ✅ Test transaction atomicity when updating featured status
    ✅ Test Django signals for notifying users about new featured content
    ✅ Test database indexing strategies for featured content queries

## Page 6
- **Title:** Featured Collection
- **Mock-up:** ![collection](https://github.com/user-attachments/assets/715a8fb5-3c9a-4b2a-bf88-68587b07e147)
- **Description:**
    The Featured Collection page showcases a curated list of books selected for a specific theme or reason. This page can be accessed by clicking on the 'See the Collection' button on the Featured page. It includes a collection title and a brief description explaining why the collection was chosen. The page displays the books in the collection with their covers, titles, authors, and short blurbs. Featured books retain the "Add to Shelf" on image-hover functionality available on other pages.
- **Required Parameters:** 
    - Active login session
    - User clicks on 'see the collection' button on 'featured' page
- **Necessary Data for Render:**
    - Collection title and description
    - Collection metadata (creation date, curator, theme, tags, popularity metrics)
    - Curated list of books from the database (book IDs, order within collection)
    - Book metadata (title, author, cover, description, publication date, genre)
    - Collection organization data (sections, categories within collection)
    - Related collections recommendations
    - User interaction data with this collection (views, books added to shelf)
    - Collection sharing options and social metrics
    - Curator profile and other collections by same curator
    - Collection history (previous versions, updates)
    - User's shelf data (to indicate which books are already saved)
    - Collection availability information (limited time, permanent)
- **Link Destination:** /collection
- **List of Tests for Render:**
    ✅ Page loads successfully with an active session
    ✅ Display of collection title and description
    ✅ Display of all books in the collection
    ✅ Clicking on a book redirects to the correct detail page
    ✅ Correct display of book metadata
    ✅ Error handling when the database fails to load data
    ✅ Infinite scroll or pagination for large collections
    ✅ "Add to Shelf" button works as expected
- **Django Database Tests:**
    ✅ Test Collection model with M2M relationships to Book model
    ✅ Test through models for storing book order within collections
    ✅ Test database queries for collection retrieval with prefetch_related
    ✅ Test Django's ContentType framework if collections can contain varied content
    ✅ Test database constraints for collection integrity
    ✅ Test transaction isolation when updating collection contents
    ✅ Test Django signals for updating collection statistics
    ✅ Test database indexing for collection queries
    ✅ Test model methods for collection organization and filtering
    ✅ Test Django admin customization for managing collections
    ✅ Test database performance with large collections using Django debug
