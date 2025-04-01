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