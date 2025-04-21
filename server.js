// server.js updated to include full functionality from both app.py and original server.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_SJNojOlDZ37x@ep-dry-wildflower-a8ojs434-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Routes
app.get('/', (req, res) => res.redirect('/home'));

// Home page with genres
app.get('/home', async (req, res) => {
  try {
    const genres = {
      'Science Fiction': 'books_sci_fi',
      'Mystery & Thriller': 'books_mystery',
      'Biographies & Memoirs': 'books_biography',
      'Poetry': 'books_poetry'
    };
    const results = {};
    const allGenreBooks = [];

    for (const genre in genres) {
      const query = `
        SELECT b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre,
               STRING_AGG(DISTINCT p.name, ', ') FILTER (WHERE p.name IS NOT NULL) AS author
        FROM books_book b
        LEFT JOIN books_book_authors ba ON b.gutenberg_id = ba.book_id
        LEFT JOIN books_person p ON ba.person_id = p.id
        WHERE b.genre = $1
        GROUP BY b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre
        LIMIT 25;
      `;
      const { rows } = await pool.query(query, [genre]);
      const books = rows.map(row => ({
        id: row.id,
        title: row.title,
        cover_image_url: row.cover_image_url,
        author: row.author?.trim() || 'Unknown',
        download_url: `https://www.gutenberg.org/files/${row.gutenberg_id}/${row.gutenberg_id}-0.txt`
      }));
      results[genres[genre]] = books;
      allGenreBooks.push(...books);
    }

    results['books_new'] = allGenreBooks.sort(() => 0.5 - Math.random()).slice(0, 10);
    res.render('home', results);
  } catch (err) {
    console.error("Database error:", err);
    res.render('home', {
      books_sci_fi: [], books_mystery: [], books_biography: [], books_poetry: [], books_new: []
    });
  }
});

// Search with filtering
app.get('/searchPage', async (req, res) => {
  const searchQuery = req.query.q || '';
  const genre = req.query.genre || '';
  const author = req.query.author || '';
  const year = req.query.year || '';
  const format = req.query.format || '';
  const rating = req.query.rating || '';

  try {
    let query = `
      SELECT DISTINCT b.*, 
             string_agg(DISTINCT s.name, ', ') AS genres,
             string_agg(DISTINCT p.name, ', ') AS authors
      FROM books_book b
      LEFT JOIN books_book_genre bbg ON b.gutenberg_id = bbg.book_id
      LEFT JOIN books_subject s ON bbg.subject_id = s.id
      LEFT JOIN books_book_authors bba ON b.gutenberg_id = bba.book_id
      LEFT JOIN books_person p ON bba.person_id = p.id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 1;

    if (searchQuery) {
      query += ` AND (
        LOWER(b.title) LIKE LOWER($${paramCount}) 
        OR EXISTS (
          SELECT 1 FROM books_person p2 
          JOIN books_book_authors bba2 ON p2.id = bba2.person_id 
          WHERE bba2.book_id = b.gutenberg_id AND LOWER(p2.name) LIKE LOWER($${paramCount})
        )
        OR EXISTS (
          SELECT 1 FROM books_subject s2 
          JOIN books_book_genre bbg2 ON s2.id = bbg2.subject_id 
          WHERE bbg2.book_id = b.gutenberg_id AND LOWER(s2.name) LIKE LOWER($${paramCount})
        )
      )`;
      queryParams.push(`%${searchQuery}%`);
      paramCount++;
    }

    if (genre && genre !== 'all') {
      query += ` AND EXISTS (
        SELECT 1 FROM books_subject s3 
        JOIN books_book_genre bbg3 ON s3.id = bbg3.subject_id 
        WHERE bbg3.book_id = b.gutenberg_id AND LOWER(s3.name) LIKE LOWER($${paramCount})
      )`;
      queryParams.push(`%${genre}%`);
      paramCount++;
    }

    if (author) {
      query += ` AND EXISTS (
        SELECT 1 FROM books_person p3 
        JOIN books_book_authors bba3 ON p3.id = bba3.person_id 
        WHERE bba3.book_id = b.gutenberg_id AND LOWER(p3.name) LIKE LOWER($${paramCount})
      )`;
      queryParams.push(`%${author}%`);
      paramCount++;
    }

    if (year) {
      query += ` AND b.title LIKE $${paramCount}`;
      queryParams.push(`%${year}%`);
      paramCount++;
    }

    query += ` GROUP BY b.gutenberg_id, b.download_count, b.media_type, b.title, b.copyright, b.gutenberg_url, b.cover_image_url LIMIT 50`;

    const searchResult = await pool.query(query, queryParams);

    res.render('searchPage', {
      books: searchResult.rows,
      searchQuery,
      filters: { genre, author, year, format, rating }
    });
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).send('<h1>Error occurred</h1><p>There was an error while processing your request. Please try again later.</p>');
  }
});

// Filter suggestion endpoint
app.get('/api/filter-suggestions', async (req, res) => {
  const type = req.query.type;
  const term = req.query.term || '';

  try {
    let query;
    if (type === 'genre') {
      query = `SELECT DISTINCT name FROM books_subject WHERE LOWER(name) LIKE LOWER($1) ORDER BY name LIMIT 20`;
    } else if (type === 'author') {
      query = `SELECT DISTINCT name FROM books_person WHERE LOWER(name) LIKE LOWER($1) ORDER BY name LIMIT 20`;
    } else {
      return res.status(400).json({ error: 'Invalid suggestion type' });
    }

    const result = await pool.query(query, [`%${term}%`]);
    res.json(result.rows.map(row => row.name));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply filters API
app.post('/api/apply-filters', async (req, res) => {
  try {
    const { genre, author, year, format, rating } = req.body;
    res.json({ 
      success: true, 
      message: 'Filters applied',
      appliedFilters: { genre, author, year, format, rating }
    });
  } catch (error) {
    console.error('Error applying filters:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// API route to fetch book details
app.get('/api/books/:gutenberg_id', async (req, res) => {
  const gutenbergId = req.params.gutenberg_id;
  try {
    const bookResult = await pool.query(`SELECT * FROM books_book WHERE gutenberg_id = $1`, [gutenbergId]);
    if (bookResult.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    const book = bookResult.rows[0];

    const authors = (await pool.query(`
      SELECT name FROM books_person bp
      JOIN books_book_authors bba ON bp.id = bba.person_id
      WHERE bba.book_id = $1
    `, [gutenbergId])).rows.map(r => r.name);

    const genres = (await pool.query(`
      SELECT name FROM books_subject bs
      JOIN books_book_genre bbg ON bs.id = bbg.subject_id
      WHERE bbg.book_id = $1
    `, [gutenbergId])).rows.map(r => r.name);

    const summaryResult = await pool.query(`SELECT text FROM books_summary WHERE book_id = $1`, [gutenbergId]);
    const description = summaryResult.rows[0]?.text || 'No description';

    res.json({
      title: book.title,
      author: authors.join(', '),
      genre: genres.join(', '),
      cover_image_url: book.cover_image_url || 'default-image-url.jpg',
      description
    });
  } catch (err) {
    console.error('Error fetching book data:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Static render routes
app.get('/myShelf', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'myShelf.html')));
app.get('/featured', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'featured.html')));
app.get('/collection', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'collection.html')));

app.listen(port, () => console.log(`🚀 Server is running on http://localhost:${port}`));
