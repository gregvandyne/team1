# Litflix (Team 1) - SQL Testing Documentation

**Purpose:** This document attempts to describe the database design and data access routines for our project, Litflix. It includes details about four tables (along with their fields, constraints, and relationships) and the functions (queries) used to access that data. Sample tests of how the database will be validated are listed as well.

**Authors:** Talia Betourney, Greg Vandyne, Clayton Braden, and Jason Wells

## Tables

### 1. Table: books_book

- **Table Description:**  
  Stores all details for each book obtained from Project Gutenberg. It includes metadata such as the download count, Gutenberg ID, title, links (e.g., to the Gutenberg page and cover image), and copyright information

- **Fields and Descriptions:**

  - **id:**  
    *Description:* Primary key (auto-increment integer)  
    *Constraint:* Must be unique

  - **download_count:**  
    *Description:* Integer that shows how many times this book has been downloaded.  
    *Constraint:* Can be null (or default to 0).

  - **gutenberg_id:**  
    *Description:* The unique identifier provided by Project Gutenberg.  
    *Constraint:* Must be numeric; ideally unique.

  - **media_type:**  
    *Description:* A string indicating the type of media (e.g., "text", "audio").  
    *Constraint:* Not null if your application distinguishes between types.

  - **title:**  
    *Description:* The full title of the book.  
    *Constraint:* Required (non-null).

  - **copyright:**  
    *Description:* Copyright information.

  - **gutenberg_url:**  
    *Description:* URL pointing to the Project Gutenberg page of the book.  
    *Constraint:* Should follow a valid URL format.

  - **cover_image_url:**  
    *Description:* URL with the link to the cover image.  
    *Constraint:* Valid URL format.

  - **cover_image:**  
    *Description:* Field used to store a cover image file/binary data  
    *Constraint:* Depends on our implementation (URL).

- **Relationships:**

  - A one-to-many relationship exists with the books_book_author table (one book can be linked to one or more authors).

- **List of Tests for books_book:**

**Test Case 1: Insert and Retrieve Book Record**

- **Use case name:** Verify insertion of a valid book record

- **Description:** Insert a new book record and then query it by id.

- **Pre-conditions:** None (table exists, and id is auto-generated).

- **Test steps:**

  1. Insert a record with valid values (e.g., title:"Romeo and Juliet", gutenberg_id:1513, gutenberg_url, etc.).

  2. Query the record based on the returned id.

  3. Verify that all field values match the expected values.

- **Expected result:** The retrieved record matches the inserted data.

- **Post-conditions:** The record exists in the database.

**Test Case 2: Update Download Count**

- **Description:** Update the download_count for an existing book record.

- **Test steps:**

  1. Select a book record.

  2. Update its download_count field.

  3. Query the record and verify the download_count has been updated.

- **Expected result:** The new download_count is correctly stored.

**Test Case 3: Constraint Verification**

- **Description:** Attempt to insert a book record without a title.

- **Test steps:**

  1. Execute an INSERT query without providing a title value.

- **Expected result:** The database should reject the insert due to a NOT NULL constraint on title.

### 2. Table: books_person

- **Table Description:**  
  This table stores information about persons relevant to our project.

- **Fields and Descriptions:**

  - **id:**  
    *Description:* Primary key (auto-increment integer).  
    *Constraint:* Unique.

  - **birth_year:**  
    *Description:* The birth year of the person.  
    *Constraint:* Optional; may be null.

  - **death_year:**  
    *Description:* The death year of the person.  
    *Constraint:* Optional; may be null.

  - **name:**  
    *Description:* Full name of the person.  
    *Constraint:* Required (non-null).

- **Relationships:**

  - A one-to-many relationship with books_book_author (each person might be linked to multiple books).

- **List of Tests for books_person:**

**Test Case 1: Insert and Retrieve Person**

- **Use case name:** Verify insertion of a person record

- **Description:** Insert a new person and then retrieve the record by id.

- **Test steps:**

  1. Insert a record with name "Shakespeare, William" and optional birth/death years.

  2. Query the record using the generated id.

  3. Confirm that all fields (name, birth_year, death_year) are stored as expected.

- **Expected result:** A valid record is returned with correct values.

**Test Case 2: Null Handling**

- **Description:** Insert a person without birth/death years.

- **Test steps:**

  1. Insert a person record with only a name.

  2. Verify that the record has null values for birth_year and death_year without errors.

- **Expected result:** Record is successfully inserted.

**Test Case 3: Unique Identification**

- **Description:** Ensure that two persons with the same name are allowed or flagged depending on design (if you add a unique constraint on name in the future).

- **Test steps:**

  1. Insert a person with name "Jane Austen."

  2. Insert another record with name "Jane Austen."

  3. Verify that both records exist if no unique constraint exists, or receive an error if one is intended.

- **Expected result:** Consistent with design decisions regarding uniqueness.

### 3. Table: books_book_author

- **Table Description:**  
  This junction (many-to-many) table links books (from books_book) with persons (from books_person). It allows a book to have multiple authors and an author to be linked to several books. An extra field (column_1) may provide additional information (such as a display version of the author name) if needed.

- **Fields and Descriptions:**

  - **id:**  
    *Description:* Primary key (auto-increment integer).  
    *Constraint:* Unique.

  - **book_id:**  
    *Description:* Foreign key that references books_book.id.  
    *Constraint:* Must match an existing book record.

  - **person_id:**  
    *Description:* Foreign key that references books_person.id.  
    *Constraint:* Must match an existing person record.

  - **column_1:**  
    *Description:* A text field for an override author name or additional author information.  
    *Constraint:* Optional.

- **Relationships:**

  - Many-to-one with books_book and many-to-one with books_person. Together, they enforce the many-to-many relationship between books and persons.

- **List of Tests for books_book_author:**

**Test Case 1: Insert and Verify Link**

- **Use case name:** Verify linking a book to an author

- **Description:** After inserting a record in books_book_author linking an existing book and an existing person, verify that the association exists.

- **Test steps:**

  1. Ensure that valid book_id and person_id exist in books_book and books_person.

  2. Insert the linking record with these ids.

  3. Query the table with the given book_id and person_id.

- **Expected result:** A record is found that correctly links the two.

**Test Case 2: Foreign Key Constraint**

- **Description:** Attempt to insert a record with a non-existent book_id or person_id.

- **Test steps:**

  1. Run an INSERT with an invalid book_id (one that does not exist).

- **Expected result:** The INSERT must fail due to foreign key constraints.

**Test Case 3: Duplicate Linking (if applicable)**

- **Description:** If a composite unique constraint is desired on (book_id, person_id), then attempt to insert the same link twice.

- **Test steps:**

  1. Insert a valid link.

  2. Attempt to insert a duplicate link with the same book_id and person_id.

- **Expected result:** The second insert should fail if a uniqueness constraint is in place.

### 4. Table: PRIVATE.USERS

- **Table Description:**  
  This table holds the information related to the users (hashed password, email, and username). This table is updated when an account is created and used in the login page.

- **Fields and Descriptions:**

  - **userId:**  
    *Description:* Primary key (auto-increment integer).  
    *Constraint:* Unique.

  - **userUsername:**  
    *Description:* Text field for the user's username  
    *Constraint:* Unique

  - **userEmail:**  
    *Description:* Text field for the user's email  
    *Constraint:* unique

  - **userPassword**  
    *Description:* A hashed password from the users input in the password section  
    *Constraint:* Must be greater

**Test Case 1:**

**Use case name:** 

Verify Username, Email, and Password inserted into Database

**Description:** 

After creating an account with a username, email, and password, the user data is successfully stored in the database.

**Preconditions:**

1. User is entering a valid username, email, and password that has not been inserted into database before

**Test steps:**

1. Start test server (node server.js).

2. Navigate to the provided server link with /createAccount as the route. http://localhost:3000/createAccount. Certain packages may need to be installed prior to running node server.js.

2. Insert a username, email, and password in textboses. Click create Account.

3. Allow for page to query the results and provide a response if the account was created succesfully or not.

4. Verify that the screen is taken to the login page.

**Expected result:** A message will pop up if the account was created successfully. The username, email, and a hashed password should be inserted into the database and a userID assigned with the user

**Actual result** (when you are testing this, how can you tell it worked):

1. After creating an account, verify in the database that the user was inserted by running the SQL query:

> SELECT * FROM PRIVATE.USERS
> 
> ORDER BY userId DESC
> 
> LIMIT 1;

Verify the returned data matches the information submitted in the createAccount page

Status (Pass/Fail, when this test was performed)

- Pass

Notes:

- N/A

Post-conditions (what must be true about the system when the test has completed successfully):

- User information will be entered into remote database.

- User routed back to the login page.

**Test Case 2:**

**Use case name:** 

Verify login page with username and password

**Description:** 

After creating an account with a username, email, and password. The user can login in using the provided credentials

**Preconditions:**

1. User is attempting to login with a valid username and password that has been inserted into database. Can use entry from test case or use below example:

> Username: testUser1
> 
> Password: password

**Test steps:**

1. Start test server (node server.js).

2. Navigate to the provided server link with /login as the route. (http://localhost:3000/login) Certain packages may need to be installed prior to running node server.js.

3. Login to the page

4. Allow for page to query the results and provide a response if the account was created succesfully or not.

5. Verify that the screen is taken to the login page.

**Expected result:** A message will pop up if the account was created successfully. The username, email, and a hashed password should be inserted into the database and a userID assigned with the user

**Actual result** (when you are testing this, how can you tell it worked):

1. After successfully logging in, a message will appear in browser and user will be routed to the myShelf page.

Status (Pass/Fail, when this test was performed)

- Pass

Notes:

- N/A

Post-conditions (what must be true about the system when the test has completed successfully):

- User routed the /myShelf page.

**Test Case 3:**

**Use case name:** 

Verify duplicate username and email not allowed.

**Description:** 

When attempting creating an account with a username or email that has already been inserted, user will be provided with an error message.

**Preconditions:**

1. User is attempting to create an account with a username, email, or that has already been entered. Use below data as an example when attempting to create an account:

> Username: testUser1
> 
> Email: testUser1@email.com
> 
> Password: password

**Test steps:**

1. Start test server (node server.js).

2. Navigate to the provided server link with /createAccount as the route. (https:..../createAccount. Certain packages may need to be installed prior to running node server.js.

3. Allow for page to query the results and provide a response if the account was created succesfully or not.

4. Verify a message appears on the browser that states the username or email already exists.

5. Verify the screen remains on the createAccount page.

**Expected result:** A message will pop up that the username or email already exists.

**Actual result** (when you are testing this, how can you tell it worked):

1. After attempting to create an account with a duplicate email or username, the entry will not be inserted into the database. User remains on same page.

> SELECT * FROM PRIVATE.USERS
> 
> ORDER BY userId DESC
> 
> LIMIT 1;

Verify the result is not related to userUsername: testUser1 or userEail: testUser1@email.com

Status (Pass/Fail, when this test was performed)

- Pass

Notes:

- N/A

Post-conditions (what must be true about the system when the test has completed successfully):

- User remains on the createAccount page.

## Data Access Methods (Functions)

For each table (or based on common queries), we have created functions that are used to retrieve the data in our application. Below are example specifications.

**Function: get_book_by_id(book_id)**

- **Description:**  
  Retrieves a book record from the books_book table based on the provided book_id.

- **Parameters:**

  - book_id (Integer): The identifier of the book.

- **Return Value:**

  - A dictionary or object containing the book's details (including title, URL, download_count, etc.) if found; otherwise, null (or an empty result).

- **List of Tests:**

**Test Case: Retrieve Valid Book**

- **Use case name:** Verify retrieval of a book record by id

- **Pre-conditions:** A book with id (e.g., 5) exists in books_book.

- **Test steps:**

  1. Call get_book_by_id(5).

  2. Examine the returned object.

- **Expected result:** The record should display title "Romeo and Juliet" along with the expected Gutenberg ID and URLs.

- **Post-conditions:** Returned data reflects what is stored in the database.

**Function: get_author_by_id(person_id)**

- **Description:**  
  Retrieves an author/person record from the books_person table based on the person_id.

- **Parameters:**

  - person_id (Integer): The identifier of the person.

- **Return Value:**

  - A dictionary or object containing the person's details (name, birth_year, death_year) if found; otherwise null.

- **List of Tests:**

**Test Case: Retrieve Valid Author**

- **Use case name:** Verify retrieval of an author by id

- **Pre-conditions:** A person with id (e.g., 6 corresponding to "Shakespeare, William") must exist.

- **Test steps:**

  1. Call get_author_by_id(6).

  2. Confirm the returned object includes the name "Shakespeare, William".

- **Expected result:** The correct record for the author is returned.

**Function: get_book_authors(book_id)**

- **Description:**  
  Retrieves a list of authors associated with a specific book. The function performs a join on books_book_author and books_person to return readable author names.

- **Parameters:**

  - book_id (Integer): The identifier of the book.

- **Return Value:**

  - A list (or array) of author names (strings) associated with the given book.

- **List of Tests:**

**Test Case: Retrieve Authors for a Book**

- **Use case name:** Verify retrieval of author list by book id

- **Pre-conditions:** The book (e.g., id 10) is linked to one or more authors in books_book_author.

- **Test steps:**

  1. Call get_book_authors(10).

  2. Check whether the returned list includes the expected names (for example, "Carroll, Lewis" if that is the linked author).

- **Expected result:** The function returns an array with one or more author names for the book.

## Page Data Access and Verification

Because multiple pages in the application need to display database information, the following pages are relevant:

**Page: Book Detail Page**

- **Description:**  
  Displays full details for a book -- including title, cover image, Gutenberg URL, and a list of associated authors.

- **Data Access Requirements:**

  - Call to get_book_by_id(book_id)

  - Call to get_book_authors(book_id)

- **List of Tests:**

**Test Case: Verify Book Detail Display**

- **Use case name:** Verify Book Detail Page shows complete data

- **Pre-conditions:** A valid book record with associated author records exists.

- **Test steps:**

  1. Navigate to the URL /book/{book_id}.

  2. Confirm that the title, cover image, Gutenberg link, and list of authors are rendered.

- **Expected result:** The page displays all required book details.

**Page: Author Detail Page**

- **Description:**  
  Displays information about a selected author and lists all books associated with that author.

- **Data Access Requirements:**

  - Call to get_author_by_id(person_id)

  - Query or function to list books by the author (this might involve a join between books_book_author and books_book).

- **List of Tests:**

**Test Case: Verify Author Detail Display**

- **Use case name:** Verify Author Detail Page shows author details and related books

- **Pre-conditions:** An author record exists with related books.

- **Test steps:**

  1. Navigate to /author/{person_id}.

  2. Confirm that the author's name and additional details are displayed along with a list of related books.

- **Expected result:** The page content corresponds to the database records for that author.
