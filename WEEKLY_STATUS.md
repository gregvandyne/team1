# Team 1 'LitFlix' Weekly Status
## Team Members: Talia Betourney, Jason Wells, Clayton Braden, Greg Vandyne
---
**Status Report 1: Meeting from 2/27/2025**

![Jira_WeeklyStatus1](https://github.com/user-attachments/assets/88dfbe54-5e0f-4122-8da1-20f4e3f41891)

**Project Status at Start of Meeting:**  
The project currently has designs for three of the four main landing pages of the website: *home*, *my shelf*, and *search results*. The base HTML, CSS, and JavaScript code for the *home* page has been written and is functional-- as much as is feasible without database connection. Team members have researched how we will integrate data from Project Gutenberg, as well as the APIs available from Open Library. Members report that the database has been migrated and the server is in a runnable state on local. Talia and Greg will continue to work together on web page development, as Clayton and Jason are focused on establishing a server and storage for the database.

**Reports for In-Progress Work:**  
**Talia:**     
Talia worked on initial designs last week for the *my shelf* and *search results* landing pages. This week they will design and share a mock-up for the *featured* page. Upon team approval, Talia will then proceed to develop the code for the *featured* page in line with the development and styling Greg has laid out in his code for the other three landing pages. 

**Greg:**  
Last week, Greg developed the initial HTML, CSS, and Javascript code for the *home* page. This week, he used Talia's designs as reference to develop the base of the *my shelf* and *search results* pages. The *search results* page will be developed without the "Advanced Search" widget temporarily in order to allow other team members to provide a finalized design. 

**Jason & Clayton:**   
In the last week, Jason and Clayton met twice to discuss database design and implementation. As stated above in Project Status, the database has been migrated and runs locally. This includes a base database of 100 books (more can be added later) that includes book title, authors, gutenberg_id, URL for accessing book, and a cover image URL which scrapes from the HTML URL. More data fields such as description, subject, and download count, can be added fairly easily but will store only the main items to avoid data storage overhead.

**Jason:**   
This week, Jason will continue to assist Clayton in database implementation and management. He will also continue research on how to leverage our other API resources from Open Library. Jason will also begin to develop a list of feasible search categories for the "Advanced Search" widget. In addition, Jason is working on finding an optimal server to store the database that provides full functionality and low cost.

**Clayton:**   
Clayton will continue to develop the database implementation. He will begin integrating the data into Greg's code for the home page in order to test connections and database functionality. Clayton may also work together with Jason to brainstorm the necessary data to render each page. 

This report of status puts our team on track to meet the 03/13/2025 deadline to provide our Web Page Designs. We will discuss the necessary elements of Project Milestone 4 during our next weekly meeting to ensure task coverage.  

---

**Status Report 2: Check-in from week of 03/03/2025**   

Team collectively decided to pause efforts on the Litflix group project for the week in order to focus on midterm exams. Development efforts will resume on 3/10.   

---

**Status Report 3: Check-in from week of 03/10/2025**

The team reviewed current project completion and designated tasks for the Web Page Designs project milestone. The division of tasks is as follows:

- Talia: Doc creation, page titles, design mock-ups, page descriptions, link destinations, parameters for render
- Greg: list of tests for render, necessary data for render
- Clayton: Revising/adding to data render and testing sections
- Jason: Revising/adding to data render and testing sections  

Regarding development, Clayton was able to set up database hosting on neon.tech and is uploading data for all of our necessary data points. Clayton will coordinate with Jason to implement additional necessary data points (book attributes, user login information, etc.)

---

**Status Report 4: Check-in from week of 03/17/2025**

Talia:
Talia developed initial code for the 'featured' general landing page, as well as the 'featured collection' page. They have been working to align the styling with the CSS already developed by Greg in order to establish a cohesive visual theme across the website. Talia is working to link the pages so that all destinatinations can be reached through user-click events instead of manual website path updates.  

Clayton: 
Clayton developed initial code for a 'login' and 'create account' page that links to the database via javascript. Clayton will coordinate with Jason to discuss how to route data to the 'search'page and any other concerns regarding the database.    

---

**Status Report 5: Check-in from week of 03/24/2025**

Spring Break: Team paused development for the Spring Break holiday. Development efforts will resume 3/31.   

---

**Status Report 6: Check-in from week of 03/31/2025**

The team is developing the SQL design document for Project Milestone 5. Jason and Clayton are the database leads so they will take the primary role in document development. Talia and Greg will provide document revisions and support.

Regarding development, Talia will be ensuring the Weekly Status document is updated with all meeting notes and reports of project progress. They will also be revising the 'featured collection' page and writing up the page text for the 'featured author' section of 'featured'.    

---
