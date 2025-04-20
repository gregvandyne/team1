//server.js file intended to connect database backend to front end

//Import necessary modules
const { Pool } = require('pg'); // PostgreSQL client for Node.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // For password hashing
const path = require('path');
const app = express();
const port = 3000;


//Test server setup with simple message
app.get("/", (req, res) => {
    res.send("Welcome to the server!");
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public';
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('DB error');
    }
});

//set EJS as your view engine:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

//get route to set HTML page up for create Account page
app.get('/createAccount', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'createAccount.html'));
});

//route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'loginPage.html'));
});

//route for the myShelf page after logging in 
app.get('/myShelf', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'myShelf.html'));
});

//directs routes for createAccount.html and createAccount.js
app.use(express.static(__dirname));

//serves files from static folder like .css
app.use(express.static(path.join(__dirname, 'static')));
// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Neon Database Connection Configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_SJNojOlDZ37x@ep-dry-wildflower-a8ojs434-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false } // Required for SSL connection
});

//Dynamic home page route to include DB using ejs tools
app.get('/home', async (req, res) => {
    try {
        const sectionsResult = await pool.query('SELECT * FROM books_featured_section');
        const itemsResult = await pool.query(`
            SELECT f.section_id, b.*
            FROM books_featured_item f
            JOIN books_book b ON f.book_id = b.gutenberg_id
            ORDER BY f.section_id, f.rank
        `);

        const featuredSections = sectionsResult.rows;
        const featuredBooks = itemsResult.rows;

        // Organize books by section_id
        const booksBySection = {};
        featuredBooks.forEach(book => {
            if (!booksBySection[book.section_id]) {
                booksBySection[book.section_id] = [];
            }
            booksBySection[book.section_id].push(book);
        });

        // Render with the correct data
        res.render('index', { featuredSections, booksBySection });
    } catch (error) {
        console.error('Error fetching featured content:', error);
        res.status(500).send('Error loading homepage.');
    }
});


// Handle account creation (Sign up)
app.post('/createAccount', async (req, res) => {
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
  console.log('BODY:', req.body); // Should log the full object
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
        console.log("Succesful login, redirecting to /myShelf page")
        return res.redirect('/myShelf');

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
});port

//search Page route
app.get('/searchPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'searchPage.html'));
});

//featured Page route 
app.get('/featured', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'featured.html'));
});

//collection Page route 
app.get('/collection', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'collection.html'));
});

//route to get book data when clicked\
app.get('/api/books/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    // Get book base info
    const bookResult = await pool.query(`
      SELECT * FROM books_book WHERE id = $1
    `, [bookId]);

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = bookResult.rows[0];

    // Get authors
    const authorsResult = await pool.query(`
      SELECT name FROM books_person bp
      JOIN books_book_authors bba ON bp.id = bba.person_id
      WHERE bba.book_id = $1
    `, [bookId]);

    const authors = authorsResult.rows.map(row => row.name);

    // Get genres (aka subjects)
    const genreResult = await pool.query(`
      SELECT name FROM books_subject bs
      JOIN books_book_subjects bbs ON bs.id = bbs.subject_id
      WHERE bbs.book_id = $1
    `, [bookId]);

    const genres = genreResult.rows.map(row => row.name);

    // Get summary
    const summaryResult = await pool.query(`
      SELECT text FROM books_summary WHERE book_id = $1
    `, [bookId]);

    const description = summaryResult.rows[0]?.text || 'No description';

    // Respond with combined data
    res.json({
      title: book.title,
      author: authors.join(', '),
      genre: genres.join(', '),
      description: description,
      cover_image_url: book.cover_image_url
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});