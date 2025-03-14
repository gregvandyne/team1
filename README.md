# team1
__Project title:__ LitFlix

__Team #:__ Team 1

__Team/Product Name:__ Team 1 - Litflix

__Team members:__ 
* Talia Betourney (tebetourney, Talia.Betourney@colorado.edu) 
* Greg Vandyne (gregvandyne, Greg.Vandyne@colorado.edu)
* Clayton Braden (claytonbraden, clayton.braden@colorado.edu)
* Jason Wells (jawe4972, jason.wells-1@colorado.edu)

__Day/Time/TimeZone for the scheduled team weekly meeting (30 minutes via Zoom):__ Mondays, 9-9:30am (MT)

__Vision statement:__ Opening the doors to the vast world of literary masterpieces one electronic page at a time; Litflix transforms the reading experience, making reading the classics as bingeable as your favorite TV show. 

__Motivation:__ We wish to connect users to published works freely available online due to public domain. Our site collects together e-texts from across multiple online libraries/data repositories and allows users to browse the collection in a slick UI. The homepage is reminiscent of common streaming services for visual media (Netflix, Peacock, Hulu) with scrollable sections based on genre, the user’s past reading interests, and current events.Upon selecting a text, it is added to the user’s shelf. On the ‘My Shelf’ page, users can select a text to read its plot blurb, publishing information, and select if they want to read the e-text natively in the web browser or download the EPUB file. 

__Product Mock-Up:__ ![LitFlix_final](https://github.com/user-attachments/assets/60f59a14-afb6-4ecb-a9ca-0267c3037ccb)

__Technologies & Resources:__ HTML, CSS, React, Javascript, SQL, Project Gutenberg (repository of every published work in public domain), Open Library (APIs for book/author search, book covers, etc.), LibriVox (audiobooks in the public domain), Google Books (API for preview/blurb page for each book)

__Risks to project completion:__ 

**Technical Risks**

* Database Development and Scale Risks \- Some of the books that will be offered will have different formats or APIs to be integrated into the database. Additionally, there will be a large volume of books which carry a lot of information (data). Implementing these into a database collection along with user data may pose challenges.  
* User Interface Complexity \- Building a Netflix like user interface with animations and various features will require some effort in the front end development which may be time-consuming  
* Book Recommendation System \- .Building a program that provides recommendations to users based on previous past interest may require some advanced machine learning skills / algorithms and an advanced database system.  
* Changes from external libraries \- As the project moves forward, an external library may change their formatting or APIs for access to their books. Adapting to these changes so the program is still functional may require monitoring or updates as the project continues.

**Project Development Risks**

* Resources (human, financial) \- With only four people, certain technical aspects may have to be learned by certain members with no previous experience. This may slow down implementation of certain features. Additionally, as more books, features, and users are added, the database will become more costly to maintain so lack of financial resources may become an issue.  
* Project Scope Creep \- Many features and changes may be desired as the project goes on like addition of books or addition of certain features. Ensuring project scope is well defined and attainable before the project will be needed to allow for completion in a timely manner.

**Legal & Security Risks**

* Copyright Risks \- While this project focuses on books within the public domain, it will be important to ensure that books that are not in the public domain do not get put into the database as this can violate copyright and licensing laws.  
* Security Risks \- Collecting reading history and preferences from users may be sensitive to some users and they do not want others knowing exactly what they like to read. Ensuring a secure database system that only the user has access to their own information will be critical in ensuring privacy.

__Mitigation Strategy for above risks:__ 

**1. Define the Scope Early:**
We’ll outline exactly what LitFlix needs to do for the MVP (Minimum Viable Product) and make sure we don’t get sidetracked with unnecessary features. This means:
Locking in core features upfront (book browsing, My Shelf, reading in-browser or EPUB download).
Keeping a “Nice-to-Have” List for any extra features (audiobooks, advanced recommendations, etc.) we might tackle later.
Using feedback loops to ensure we're on track rather than reworking things last minute.

**2. Reasonable Timelines, Not a Last-Minute Sprint:**
Instead of cramming everything into the last few weeks, we’ll set deadlines for key milestones and hold ourselves accountable. That means:
Breaking the project into smaller chunks (UI setup, API integration, user shelf, reading experience, etc.).
Frequent check-ins to see what’s working and what’s stuck.
Buffer time for unexpected roadblocks (because let’s be real, there will be some).

**3. Divide and Conquer:**
Each team member will own specific parts of the project, so work moves in parallel rather than bottlenecking at one person. We’ll also pair up for critical tasks like API integration, so we’re not relying on just one person to solve tricky issues.

__Development method:__ We’re taking a hybrid approach, mixing Scrum (for structured sprints and regular check-ins) with Kanban (for visual task tracking and flexibility). Here’s how that plays out:

**Scrum Elements:**
Weekly Sprints → Every week, we set specific development goals and focus on completing them before moving on.
Daily Standups → A short 5-10 min asynchronous check-in to update progress and flag any blockers.
Sprint Reviews → At the end of each sprint, we review what’s done and adjust priorities if needed.
Retrospectives → Every couple of weeks, we reflect on what’s working and improve our process.

**Kanban Elements:**
Jira Board → A visual board showing all tasks (To Do, In Progress, Blocked, Done).
Continuous Progress Updates → No rigid sprint deadlines for every little task—some things just flow better when done incrementally.
Limit Work in Progress (WIP) → Too many open tasks = chaos. We’ll cap how many tasks each person can juggle at once.

__Project Tracking Software link:__ (https://cspb3308-team1.atlassian.net/jira/core/projects/CS3308/board)

