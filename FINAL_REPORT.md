# Final Report for "LitFlix" (Team 1)

---

## Team 1 Members: 
- Talia Betourney
- Jason Wells
- Clayton Braden
- Greg Vandyne
  
---

## Public Hosting Site:
https://team1-jf5l.onrender.com/home

---

## Version Control Repository Link:
https://github.com/gregvandyne/team1

---
## Project Tracking Link:
https://cspb3308-team1.atlassian.net/jira/core/projects/CS3308/board
- This project tracking software had little buy-in from team members, so the Product Manager (Talia) switched to weekly email blasts to the team, and all features/bugs for the week were discussed in that week's email thread.

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

### Backend/Database
*Flask:*
- Flask was used as the primary backend framework for routing, templating, and handling API communications with the Node.js server. It met our needs in that we were all familiar with how to use Flask from the course's labwork. We did have to use an external library, psycopg2, for database communication and management. Though we were all familiar with Flask, it would have been a better/simpler option to run all server operations from our Node.js server.

*Node.js:* 
- Node.js was used for database queries and managing real-time interactions, like user login and account creation. It integrated well with PostgreSQL, so our needs were met. We could have used this tool better by improving team communication and not duplicating functionality across two servers. This introduced a lot of opportunities for conflicts and complex bugs.

*PostgreSQL:* 
- PostgreSQL served as our relational database for storing book data and user account data. It met our needs, and we did not feel like a NoSQL database would have been a better approach to data management. 

### Frontend
*HTML, CSS, Javascript:* 
- These are the standard technologies for structuring/styling websites, adding interactivity, etc. and we didn't want to overcomplicate development by trying to learn a new frontend framework on the fly. If we were to reapproach the project, we may go with something like React or Vue so we could reuse some of our components, like the book modal or the advanced filter drawer from the search page. 

*EJS (Embedded JavaScript)*: 
- We used EJS for rendering dynamic HTML content on the server side. To make better use of this tool, we would've started with the pages as EJS files, rather than having to revise them from static HTML later on in development.

### Version Control, APIs and Project Management Resources
*Visual Studio Code:* 
- VS Code is the IDE we used for actually writing out the code. We had no issues using it for debugging, developing, and managing the codebase. To better use the tool for our project, we should have shared our workspace configurations with team members to ensure no issues arose from inconsistensies there. 

*Git/GitHub:* 
- We used Git and Github for all of the project's version control. If we were to start the project over, we would still use these tools because they made it easy to manage our branches, work on features separately, and roll back buggy code when needed. To use this tool better in the future, we could be stricter with how we approached branching and pushing code to main.

*Canva:* 
- We used this tool for making site mock-ups as well as our presentation slide deck. It was fine; the materials looked nice and the UI was user-friendly. If we restarted the project, I might try using Figma instead since it's more suited to web page design than Canva.

*Project Gutenberg API:*
- This was our source of public domain books which we used for book data, including links to the complete book files. This was a huge dataset and we probably bit off a bit more than we could chew; we needed a lot more time for data cleaning because there was a ton of inconsistent formatting. If we reapproached this, we would still use this API, but pull in a smaller portion and figure out how we need to clean/format it before taking in all 70,000 books at once. 

*Render:* 
- This was the cloud platform we used for deploying the Flask and Node.js servers. We were all familiar with the deployment process on Render from the class labwork and it offered a 'free' tier, so this was a straightforward choice for us. Because of our weird double-server set up, it took a little time to figure out how to set up our requirements.txt file, but that was the fault of our application and not Render. 

*Neon.tech:*
- This was our PostgreSQL database host. We chose it because it was fairly straightforward to set up and met our needs for cloud-hosting our database. It was nice that they offer a 'free' tier, which is what we used, but the resources were pretty limited without a 'premium' subscription. That seemed pretty universal though; we didn't find a lot of other options that would give us better features and performance without a cost (i.e. AWS and Google Cloud). We would likely use this same tool again. 

*Jira:*
- We initially planned to use Jira for project management but switched to weekly email updates due to low team engagement with the tool.
---

## Challenges & Methodology Reflection: 

*Challenges*


*How We'd Do Things Differently*


---
