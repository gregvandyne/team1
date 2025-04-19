//server.js file intended to connect database backend to front end

//Import necessary modules
const { Pool } = require('pg'); // PostgreSQL client for Node.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // For password hashing
const path = require('path');
const app = express();
const port = 3000;


// Define a route for "/"
app.get("/", (req, res) => {
    res.send("Welcome to the server!");
});

//get route to set HTML page up for create Account page
app.get('/create-account', (req, res) => {
    res.sendFile(path.join(__dirname, 'createAccount.html'));
});

//route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'loginPage.html'));
});

//route for the myShelf page after logging in 
app.get('/myShelf', (req, res) => {
    res.sendFile(path.join(__dirname, 'myShelf.html'));
});

//directs routes for createAccount.html and createAccount.js
app.use(express.static(__dirname));



// Neon Database Connection Configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_SJNojOlDZ37x@ep-dry-wildflower-a8ojs434-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false } // Required for SSL connection
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Handle account creation (Sign up)
app.post('/create-account', async (req, res) => {
  const { username, email, password } = req.body;

    try {
        // Check if the username or email already exists
        const checkQuery = 'SELECT * FROM "PRIVATE"."USERS" WHERE "userUsername" = $1 OR "userEmail" = $2';
        const result = await pool.query(checkQuery, [username, email]);

        if (result.rows.length > 0) {
            return res.json({ success: false, message: "Username or email already exists." });
        }

        // Hash password before storing pw in database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database, 
        const insertQuery = 'INSERT INTO "PRIVATE"."USERS" ("userUsername", "userEmail", "userPassword") VALUES ($1, $2, $3)';

        await pool.query(insertQuery, [username, email, hashedPassword]);

        return res.json({ success: true, message: "Account created successfully!" });
    } catch (error) {
        if (error.code === '23505') {
            const checkUsername = 'SELECT 1 FROM "PRIVATE"."USERS" WHERE "userUsername" = $1';
            const checkEmail = 'SELECT 1 FROM "PRIVATE"."USERS" WHERE "userEmail" = $1';

            const usernameExists = (await pool.query(checkUsername, [username])).rowCount > 0;
            const emailExists = (await pool.query(checkEmail, [email])).rowCount > 0;

            if (usernameExists && emailExists) {
                return res.json({ success: false, message: "Username and email already exist." });
            }
            else if (usernameExists) {
                return res.json({ success: false, message: "Username already exists. Choose a different one." });
            }
            else if (emailExists) {
                return res.json({ success: false, message: "Email already exists. Use a different email." });
            }
        }

        console.error("Error creating account:", error);
        return res.json({ success: false, message: "Failed to create account." });
    }
});

// Handle login (Authenticate user)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query to find the user in the database
    const result = await pool.query('SELECT * FROM "PRIVATE"."USERS" WHERE "userUsername" = $1', [username]);

    if (result.rows.length === 0) {
      // User not found
      return res.json({ success: false, message: "Invalid username or password." });
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.userPassword);

    if (isMatch) {
        return res.json({ success: true, message: "Login successful!" });

    } else {
      return res.json({ success: false, message: "Invalid username or password." });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Get books on user's shelf
app.get('/api/my-shelf', async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  try {
    // First get the user ID
    const userResult = await pool.query('SELECT "userID" FROM "PRIVATE"."USERS" WHERE "userUsername" = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userId = userResult.rows[0].userID;
    
    // Then get all books on the user's shelf
    const booksQuery = `
      SELECT b."bookID", b."bookTitle", b."bookAuthor",
             b."bookGenre", b."bookDescription", b."bookImageURL",
             b."downloadCount",          
             ub."dateAdded"
       FROM "PRIVATE"."BOOKS" b
       JOIN "PRIVATE"."USER_BOOKS" ub ON b."bookID" = ub."bookID"
      WHERE ub."userID" = $1
  ORDER BY ub."dateAdded" DESC
    `;
    
    const booksResult = await pool.query(booksQuery, [userId]);
    
    return res.json({ success: true, books: booksResult.rows });
  } catch (err) {
    console.error('Error fetching shelf:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add a book to user's shelf
app.post('/api/add-to-shelf', async (req, res) => {
  const { username, bookId } = req.body;
  
  if (!username || !bookId) {
    return res.status(400).json({ success: false, message: 'Username and bookId are required' });
  }

  try {
    // First get the user ID
    const userResult = await pool.query('SELECT "userID" FROM "PRIVATE"."USERS" WHERE "userUsername" = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userId = userResult.rows[0].userID;
    
    // Check if the book is already on the shelf
    const checkQuery = 'SELECT 1 FROM "PRIVATE"."USER_BOOKS" WHERE "userID" = $1 AND "bookID" = $2';
    const checkResult = await pool.query(checkQuery, [userId, bookId]);
    
    if (checkResult.rows.length > 0) {
      return res.json({ success: false, message: 'Book is already on your shelf' });
    }
    
    // Add the book to the shelf
    const addQuery = 'INSERT INTO "PRIVATE"."USER_BOOKS" ("userID", "bookID") VALUES ($1, $2)';
    await pool.query(addQuery, [userId, bookId]);
    
    return res.json({ success: true, message: 'Book added to your shelf' });
  } catch (err) {
    console.error('Error adding to shelf:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove a book from user's shelf
app.delete('/api/remove-from-shelf', async (req, res) => {
  const { username, bookId } = req.body;
  
  if (!username || !bookId) {
    return res.status(400).json({ success: false, message: 'Username and bookId are required' });
  }

  try {
    // First get the user ID
    const userResult = await pool.query('SELECT "userID" FROM "PRIVATE"."USERS" WHERE "userUsername" = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userId = userResult.rows[0].userID;
    
    // Remove the book from the shelf
    const removeQuery = 'DELETE FROM "PRIVATE"."USER_BOOKS" WHERE "userID" = $1 AND "bookID" = $2';
    const result = await pool.query(removeQuery, [userId, bookId]);
    
    if (result.rowCount === 0) {
      return res.json({ success: false, message: 'Book was not on your shelf' });
    }
    
    return res.json({ success: true, message: 'Book removed from your shelf' });
  } catch (err) {
    console.error('Error removing from shelf:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all available books
app.get('/api/books', async (req, res) => {
  try {
    const booksQuery = 'SELECT * FROM "PRIVATE"."BOOKS"';
    const booksResult = await pool.query(booksQuery);
    
    return res.json({ success: true, books: booksResult.rows });
  } catch (err) {
    console.error('Error fetching books:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add a sample book (for testing)
app.post('/api/add-sample-book', async (req, res) => {
  try {
    const bookQuery = `
      INSERT INTO "PRIVATE"."BOOKS" ("bookTitle", "bookAuthor", "bookGenre", "bookDescription", "bookImageURL") 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING "bookID"
    `;
    
    const bookValues = [
      'The Great Gatsby',
      'F. Scott Fitzgerald',
      'Classic',
      'A story of wealth, love, and the American Dream in the 1920s.',
      '../static/placeholder_book.jpg'
    ];
    
    const result = await pool.query(bookQuery, bookValues);
    
    return res.json({ 
      success: true, 
      message: 'Sample book added', 
      bookId: result.rows[0].bookID 
    });
  } catch (err) {
    console.error('Error adding sample book:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Increment a book's downloadCount
app.post('/api/increment-download', async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ success:false, message:'bookId required' });

  try {
    await pool.query(
      `UPDATE "PRIVATE"."BOOKS"
           SET "downloadCount" = "downloadCount" + 1
         WHERE "bookID" = $1`, [bookId]
    );
    res.json({ success:true });
  } catch (e) {
    console.error('increment-download error', e);
    res.status(500).json({ success:false, message:'Server error' });
  }
});

















