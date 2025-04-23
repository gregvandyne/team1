# Final Report for "LitFlix" (Team 1)
---
## Team 1 Members: 
Talia Betourney
Jason Wells
Clayton Braden
Greg Vandyne
---
## Public Hosting Site:
https://team1-jf5l.onrender.com/home
---
## Version Control Repository Link:
https://github.com/gregvandyne/team1
---
## Project Tracking Link:
https://cspb3308-team1.atlassian.net/jira/core/projects/CS3308/board
*This project tracking software had little buy-in from team members, so the Product Manager (Talia) switched to weekly email blasts to the team, and all features/bugs for the week were discussed in that week's email thread.*
---
## Demo Video:
https://o365coloradoedu-my.sharepoint.com/:v:/g/personal/tabe8206_colorado_edu/Eea0zEGn43ROjru-ubS3SM4B2C9KQRVqkh3kJ_yz28gFgA?e=qKk63e
---
## Presentation Materials:
https://www.canva.com/design/DAGlSla9mrQ/qMyHcY2l20HKznquhRrxlQ/edit?utm_content=DAGlSla9mrQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
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
- The search page supports filtering by genre, author, and title, but additional filters like ISBN, year, and rating are only partially implemented.

**User Shelf Management:**
- Users currently can add books to their shelf, but the book details modal does not yet support removal of books from shelf. The shelf itself does not yet support sorting and filtering, and tagging, as originally planned. 

**Dynamic Data for Featured Author and Collection:**
- The 'featured' and 'collection' pages are still running with static jpgs for the book images and book elements are not actually connected up to the database. The intent was for all of the book elements to be clickable (initiating the book details modal) so user's could add collection books to their shelf. 

**Continue Reading:**
- The 'continue reading' section on 'home' is hard-coded presently; it is not connecting up to the books added to the user's shelf. The 'continue reading' section was designed to be reflective of the user's last read book and show a progress bar overlaid on the book cover image.

**Book Details Modal:**
- The books details modal is currently pulling through the title, book cover, and author from the database, but we had not yet set it up to correctly pull in a plot blurb for the books. Any visible plot blurbs across the site are hard-coded. As stated above, 'remove from shelf' is not working, and 'add to shelf' has bugs if the user is not signed in. We had also planned for the book details modal to have a tagging system in line with the search functionality so hashtags could be clicked to initiate a search on books with the same tag (for example, Dracula would have tags like #gothic #britlit #vampires #monsters). 

---

## Planned Features:
**Recommendation System:**
- We wanted to implement a recommendation algorithm to the home page to suggest books based on user preferences and reading history.

**Enhanced User Shelf Book Details Modal:**
- We wanted to add features like custom tags, reading progress tracking, a rating system, and personalized notes for books in the user's shelf.

**Enhanced Reading Experience:**
- We had ambitious dreams of optimizing the UI for the actual reading experience, including a day/night mode, page numbers, a page-turn animation, book title/author locked at the top of the screen, chapter navigation, etc., but had to forego these in favor of other core features.

---

## Known Bugs/Issues:
- 'See the Collection' button on 'Featured' not functioning due to last-minute routing changes
- 'Read Other Works' button on 'Featured' directs to an empty search query, rather than one preloaded with 'Jane Austen'
- 'Home' page renders on first load, but navigating back to 'Home' from another page causes a 500 Internal Server Error

---

## Tool & Technology Reflection:

---

# Challenges & Methodology Reflection: 

---