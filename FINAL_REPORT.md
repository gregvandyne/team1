# Final Report for "LitFlix" (Team 1)
**Team Members: Talia Betourney, Jason Wells, Clayton Braden, Greg Vandyne**

---

## Completed Features:
**Backend Features:**
- Implemented a Flask server (app.py) for routing, templating, and API communications with the Node.js server (server.js).
- Developed a Node.js server (server.js) for advanced API handling, user authentication, and database queries.
- Established PostgreSQL database connections for both servers using psycopg2 (Flask) and pg (Node.js).

**Frontend Features:**
- Created EJS templates for dynamic rendering of pages like home, myShelf, searchPage, collection, and featured.
- Designed and implemented database-friendly pages for login and account creation. 

**Database Features:**
- Designed and populated tables for books, authors, genres, and user data.
- Added genre assignment logic for books based on keywords in titles.
- Implemented queries for retrieving books, authors, and genres efficiently.

**Deployment:**
- Deployed the application on Render with render.yaml for configuration.
- Created requirements.txt and package.json for dependency management.

---

## Partially-Implemented Features:
**Advanced Search Filtering:**

**User Shelf Management:**

**Dynamic Data for Featured Author and Collection:**

**Continue Reading:**

**Book Details Modal:**

---

## Planned Features:
**Recommendation System:**
- We wanted to implement a recommendation algorithm to the home page to suggest books based on user preferences and reading history.

**Enhanced User Shelf Book Details Modal:**
- We wanted to add features like custom tags, reading progress tracking, a rating system, and personalized notes for books in the user's shelf.

---

## Known Bugs/Issues:
- 'See the Collection' button on 'Featured' not functioning 
- 'Read Other Works' button on 'Featured' directs to an empty search query, rather than one preloaded with 'Jane Austen'
- 'Home' page renders on first load, but navigating back to 'Home' from another page causes a 500 Internal Server Error

---

## Public Hosting Site:
https://team1-jf5l.onrender.com/home
---
