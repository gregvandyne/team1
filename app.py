from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_bcrypt import Bcrypt
import psycopg2
import os
import random
import secrets

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.secret_key = secrets.token_hex(16)  # Generate a random secret key for sessions

# -------- DATABASE CONNECTION --------
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://neondb_owner:npg_SJNojOlDZ37x@ep-dry-wildflower-a8ojs434-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")

if not DATABASE_URL:
    raise ValueError("🚨 DATABASE_URL environment variable not set.")

conn = psycopg2.connect(DATABASE_URL, sslmode="require")
cursor = conn.cursor()


# -------- ONE-TIME: Add id column if not exists (non-primary key) --------
try:
    cursor.execute('''
        ALTER TABLE books_book
        ADD COLUMN id SERIAL;
    ''')
    conn.commit()
    print("✅ 'id' column added to books_book.")
except psycopg2.errors.DuplicateColumn:
    conn.rollback()
    print("ℹ️ 'id' column already exists.")
except Exception as e:
    conn.rollback()
    print("⚠️ Failed to add 'id' column:", e)

# -------- ONE-TIME: Add genre column if not exists --------
try:
    cursor.execute("ALTER TABLE books_book ADD COLUMN genre VARCHAR(100);")
    conn.commit()
    print("✅ Genre column added.")
except psycopg2.errors.DuplicateColumn:
    conn.rollback()
    print("ℹ️ Genre column already exists.")
except Exception as e:
    conn.rollback()
    print("⚠️ Error altering table:", e)

# -------- ONE-TIME: Assign Science Fiction by Author Only --------
try:
    cursor.execute('''
        UPDATE books_book
        SET genre = 'Science Fiction'
        WHERE (genre IS NULL OR genre = '') AND LOWER(title) ILIKE ANY (ARRAY[
            '%fiction%', '%fantasy%', '%science-fiction%', '%sci-fi%', '%sci fi%',
            '%fairies%', '%fairy%', '%science%', '%space%', '%alien%', '%robot%',
            '%time travel%', '%dystopian%', '%utopian%', '%post-apocalyptic%',
            '%cyberpunk%', '%steampunk%', '%biopunk%', '%nanopunk%', '%space opera%',
            '%hard science fiction%', '%soft science fiction%', '%speculative fiction%',
            '%alternate history%', '%time travel%', '%parallel universe%', '%multiverse%',
            '%artificial intelligence%', '%virtual reality%', '%augmented reality%',
            '%genetic engineering%', '%cloning%', '%terraforming%', '%extraterrestrial%',
            '%superhero%', '%supernatural%', '%magic realism%', '%mythic fiction%',
            '%urban fantasy%', '%dark fantasy%', '%grimdark%', '%epic fantasy%',
            '%high fantasy%', '%low fantasy%', '%sword and sorcery%', '%dark fantasy%',
            '%magical realism%', '%mythic fiction%', '%urban fantasy%', '%grimdark%',
            '%epic fantasy%', '%high fantasy%', '%low fantasy%', '%sword and sorcery%',
            '%dark fantasy%', '%magical realism%', '%mythic fiction%', '%urban fantasy%',
            '%grimdark%', '%epic fantasy%', '%high fantasy%', '%low fantasy%',
            '%sword and sorcery%', '%dark fantasy%', '%magical realism%', '%mythic fiction%',
            '%urban fantasy%', '%grimdark%', '%epic fantasy%', '%high fantasy%'
        ])
    ''')
    conn.commit()
    print("✅ Science Fiction genre assigned by genre keywords.")
except Exception as e:
    conn.rollback()
    print("⚠️ Failed to assign genre by author:", e)

# -------- ONE-TIME: Assign Mystery & Thriller by Genre Keywords --------
try:
    cursor.execute('''
        UPDATE books_book
        SET genre = 'Mystery & Thriller'
        WHERE (genre IS NULL OR genre = '') AND LOWER(title) ILIKE ANY (ARRAY[
            '%mystery%', '%thriller%', '%detective%', '%murder%', '%crime%',
            '%suspense%', '%investigation%', '%sherlock%', '%case of%', '%suspense%'
        ])
    ''')
    conn.commit()
    print("✅ Mystery & Thriller genre assigned by title keywords.")
except Exception as e:
    conn.rollback()
    print("⚠️ Failed to assign Mystery & Thriller genre by title keywords:", e)

# -------- ONE-TIME: Assign Biographies & Memoirs by Title Keywords --------
try:
    cursor.execute('''
        UPDATE books_book
        SET genre = 'Biographies & Memoirs'
        WHERE (genre IS NULL OR genre = '') AND LOWER(title) ILIKE ANY (ARRAY[
            '%autobiography%', '%memoir%', '%life of%', '%biography%', '%reminiscences%',
            '%journal%', '%diary%', '%personal narrative%', '%letters of%', '%account of%',
            '%frederick douglass%', '%benjamin franklin%', '%charlotte brontë%', '%slave girl%', '%up from slavery%'
        ])
    ''')
    conn.commit()
    print("✅ Biographies & Memoirs genre assigned by title keywords.")
except Exception as e:
    conn.rollback()
    print("⚠️ Failed to assign Biographies & Memoirs genre by title keywords:", e)

# -------- ONE-TIME: Assign Poetry by Genre Keywords --------
try:
    cursor.execute('''
        UPDATE books_book
        SET genre = 'Poetry'
        WHERE (genre IS NULL OR genre = '') AND LOWER(title) ILIKE ANY (ARRAY[
            '%poem%', '%poetry%', '%sonnet%', '%verse%', '%rhyme%', '%ballad%',
            '%leaves of grass%', '%paradise lost%', '%raven%', '%waste land%'
        ])
    ''')
    conn.commit()
    print("✅ Poetry genre assigned by title keywords.")
except Exception as e:
    conn.rollback()
    print("⚠️ Failed to assign Poetry genre by title keywords:", e)

# -------- ROUTES --------

@app.route('/')
def index():
    return redirect(url_for('home'))

@app.route('/home')
def home():
    username = session.get('username', '')  # Or whatever logic you use for getting the username

    cursor = conn.cursor() 
    try:
        genres = {
            'Science Fiction': 'books_sci_fi',
            'Mystery & Thriller': 'books_mystery',
            'Biographies & Memoirs': 'books_biography',
            'Poetry': 'books_poetry'
        }

        results = {}
        all_genre_books = []

        for genre, key in genres.items():
            cursor.execute('''
                SELECT b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre,
                       STRING_AGG(DISTINCT p.name, ', ') FILTER (WHERE p.name IS NOT NULL) AS author
                FROM books_book b
                LEFT JOIN books_book_authors ba ON b.gutenberg_id = ba.book_id
                LEFT JOIN books_person p ON ba.person_id = p.id
                WHERE b.genre = %s
                GROUP BY b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre
                LIMIT 25;
            ''', (genre,))
            rows = cursor.fetchall()
            books = [
                {
                    'id': row[0],
                    'title': row[1],
                    'cover_image_url': row[2],
                    'author': row[5] if row[5] and row[5].strip() else 'Unknown',
                    'download_url': f'https://www.gutenberg.org/files/{row[3]}/{row[3]}-0.txt'
                } for row in rows
            ]
            results[key] = books
            all_genre_books.extend(books)

        results['books_new'] = random.sample(all_genre_books, min(10, len(all_genre_books)))

        return render_template('home.html', **results, username=session.get('username'))

    except Exception as e:
        print("Database error:", e)
        return render_template('home.html', books_sci_fi=[], books_mystery=[], books_biography=[], books_poetry=[], books_new=[])


@app.route('/searchPage', methods=['GET'])
def searchPage():
    query = request.args.get('query', '').strip()
    if not query:
        return render_template('searchPage.html', books=[], query="")

    try:
        cursor.execute('''
            SELECT b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre,
                   STRING_AGG(DISTINCT p.name, ', ') FILTER (WHERE p.name IS NOT NULL) AS author
            FROM books_book b
            LEFT JOIN books_book_authors ba ON b.gutenberg_id = ba.book_id
            LEFT JOIN books_person p ON ba.person_id = p.id
            WHERE LOWER(b.title) ILIKE %s
               OR LOWER(p.name) ILIKE %s
               OR LOWER(b.genre) ILIKE %s
            GROUP BY b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre
            LIMIT 100;
        ''', (f'%{query.lower()}%', f'%{query.lower()}%', f'%{query.lower()}%'))

        books = cursor.fetchall()
        results = [
            {
                'id': row[0],
                'title': row[1],
                'cover_image_url': row[2],
                'author': row[5] if row[5] and row[5].strip() else 'Unknown',
                'download_url': f'https://www.gutenberg.org/files/{row[3]}/{row[3]}-0.txt'
            } for row in books
        ]

        return render_template('searchPage.html', books=results, query=query)
    except Exception as e:
        print("Search error:", e)
        return render_template('searchPage.html', books=[], query=query)

# Other routes remain unchanged
#myShelf route with session to display username books
@app.route('/myShelf')
def myShelf():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    username = session.get('username')
    print(f"Fetching shelf for username: {username}")

    try:
        # Get the userId for the logged-in user from PRIVATE schema
        cursor.execute('SELECT "userId" FROM "PRIVATE"."USERS" WHERE "userUsername" = %s;', (username,))
        user_row = cursor.fetchone()
        
        if user_row is None:
            print(f"User not found: {username}")
            return render_template('myShelf.html', books=[], username=username, error="User not found")
        
        userId = user_row[0]
        print(f"Found userId: {userId}")

        # Get the books for this user (using gutenberg_id as the primary key)
        cursor.execute("""
            SELECT b.title,
                  STRING_AGG(DISTINCT bp.name, ', ') FILTER (WHERE bp.name IS NOT NULL) AS author,
                  b.genre, 
                  bs.text AS description,
                  b.cover_image_url, 
                  b.gutenberg_id,
                  b.download_count
            FROM "PRIVATE"."USER_BOOKS" ub
            LEFT JOIN "public"."books_book" b 
                ON ub."bookId" = b."gutenberg_id"
            LEFT JOIN "public"."books_book_authors" ba 
                ON b."gutenberg_id" = ba."book_id"
            LEFT JOIN "public"."books_person" bp 
                ON ba."person_id" = bp."id"
            LEFT JOIN "public"."books_summary" bs 
                ON b."gutenberg_id" = bs."book_id"
            WHERE ub."userId" = %s
            GROUP BY b.title, b.genre, bs.text, b.cover_image_url, b.gutenberg_id, b.download_count;
        """, (userId,))

        rows = cursor.fetchall()
        print(f"Found {len(rows)} books for user")

        # Convert to list of dicts
        books = []
        for row in rows:
            books.append({
                'title': row[0],
                'author': row[1] if row[1] else "Unknown",
                'genre': row[2],
                'description': row[3],
                'cover_image_url': row[4] or '../static/placeholder_book.jpg',
                'gutenberg_id': row[5],
                'download_count': row[6] if row[6] else 0
            })

        return render_template('myShelf.html', books=books, username=username)
    except Exception as e:
        print(f"Error in myShelf route: {e}")
        return render_template('myShelf.html', books=[], username=username, error="Error loading books")


@app.route('/featured')
def featured():
    return render_template('featured.html')


@app.route('/collection')
def collection():
    return render_template('collection.html')


@app.route('/createAccount', methods=['GET', 'POST'])
def createAccount():
    if request.method == 'GET':
        return render_template('createAccount.html')

    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"success": False, "message": "Missing fields."}), 400

        print("📥 Creating account with:")
        print(f"Username: {username}, Email: {email}")

        cursor.execute('SELECT * FROM "PRIVATE"."USERS" WHERE "userUsername" = %s OR "userEmail" = %s', (username, email))
        existing_user = cursor.fetchone()
        print("👀 Existing user check:", existing_user)

        if existing_user:
            return jsonify({"success": False, "message": "Username or email already exists."})

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        print("🔐 Hashed password:", hashed_password)

        cursor.execute(
            'INSERT INTO "PRIVATE"."USERS" ("userUsername", "userEmail", "hashPassword") VALUES (%s, %s, %s)',
            (username, email, hashed_password)
        )
        conn.commit()
        print("✅ Account created successfully")
        return jsonify({"success": True, "message": "Account created successfully"})

    except Exception as e:
        print("❌ Error creating account:", e)
        return render_template("createAccount.html", error="Failed to create account.")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('loginPage.html')

    if request.method == 'POST':

        print("Login request received")

        try:
            if request.is_json:
                data = request.get_json()
                print("JSON data received:", data)
                username = data.get('username')
                password = data.get('password')
            else:
                print("Form data received:", request.form)
                username = request.form.get('username')
                password = request.form.get('password')

            print(f"Login attempt for username: {username}")

            if not username or not password:
                return jsonify({"success": False, "message": "Missing username or password."}), 400

            # Use the existing connection instead of creating a new one
            cursor = conn.cursor()
            print("Executing database query...")
            cursor.execute('SELECT "userUsername", "userEmail", "hashPassword" FROM "PRIVATE"."USERS" WHERE "userUsername" = %s', (username,))

            user = cursor.fetchone()
            print(f"User found: {user is not None}")

            if not user:
                return jsonify({"success": False, "message": "Invalid username or password."}), 401
                
            print("Checking password...")
            if not user[2] or not bcrypt.check_password_hash(user[2], password):
                return jsonify({"success": False, "message": "Invalid username or password."}), 401
            
                    # Store user information in the session
            session['logged_in'] = True
            session['username'] = user[0]  # userUsername
            session['email'] = user[1]     # userEmail
        
            print("Login successful!")
            return jsonify({"success": True, "message": "Login successful"}), 200
            
        except Exception as e:
            print("Login error:", str(e))
            import traceback
            traceback.print_exc()
            return jsonify({"success": False, "message": "Server error. Please try again later."}), 500

@app.route('/logout')
def logout():
    # Clear the session
    session.clear()
    return redirect(url_for('home'))

# Add this route provide API access to book shelf
@app.route('/addToShelf', methods=['POST'])
def add_to_shelf():
    if not session.get('logged_in'):
        return jsonify({"message": "Please log in first"}), 401
    
    # Get data from the frontend request
    data = request.get_json()
    username = session.get('username')
    book_id = data.get('book_id')
    
    if not book_id:
        return jsonify({"message": "No book ID provided"}), 400

    try:
        # Connect to your PostgreSQL database
        cursor = conn.cursor()

        # First, get the gutenberg_id from the books_book table
        cursor.execute('SELECT "gutenberg_id" FROM "public"."books_book" WHERE "id" = %s', (book_id,))
        book_row = cursor.fetchone()
        
        if book_row is None:
            return jsonify({"message": "Book not found"}), 404
        
        gutenberg_id = book_row[0]
        
        # Check if book already exists in user's shelf
        cursor.execute('''
            SELECT 1 FROM "PRIVATE"."USER_BOOKS" ub
            JOIN "PRIVATE"."USERS" u ON ub."userId" = u."userId"
            WHERE u."userUsername" = %s AND ub."bookId" = %s
        ''', (username, gutenberg_id))
        
        if cursor.fetchone():
            return jsonify({"message": "Book already in your shelf"}), 200

        # Get the userId for the logged-in user
        cursor.execute('SELECT "userId" FROM "PRIVATE"."USERS" WHERE "userUsername" = %s;', (username,))
        user_row = cursor.fetchone()
        
        if user_row is None:
            return jsonify({"message": "User not found"}), 404
        
        userId = user_row[0]

        # Insert the book into the user's bookshelf using gutenberg_id
        cursor.execute("""
            INSERT INTO "PRIVATE"."USER_BOOKS" ("userId", "bookId", "dateAdded")
            VALUES (%s, %s, NOW());
        """, (userId, gutenberg_id))

        conn.commit()
        return jsonify({"message": "Book added to shelf!"}), 200
        
    except psycopg2.Error as e:
        conn.rollback()
        print("Database error:", e)
        return jsonify({"message": "Database error occurred"}), 500
    except Exception as e:
        print("Error:", e)
        return jsonify({"message": "An error occurred"}), 500

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book_details(book_id):
    try:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre,
                   STRING_AGG(DISTINCT p.name, ', ') FILTER (WHERE p.name IS NOT NULL) AS author,
                   bs.text as description, b.download_count
            FROM books_book b
            LEFT JOIN books_book_authors ba ON b.gutenberg_id = ba.book_id
            LEFT JOIN books_person p ON ba.person_id = p.id
            LEFT JOIN books_summary bs ON b.gutenberg_id = bs.book_id
            WHERE b.gutenberg_id = %s
            GROUP BY b.id, b.title, b.cover_image_url, b.gutenberg_id, b.genre, bs.text
        ''', (book_id,))
        
        book = cursor.fetchone()
        
        if not book:
            return jsonify({"error": "Book not found"}), 404
            
        book_data = {
            "id": book[0],
            "title": book[1],
            "cover_image_url": book[2],
            "gutenberg_id": book[3],
            "genre": book[4],
            "author": book[5] if book[5] else "Unknown",
            "description": book[6] if book[6] else "No description available.",
            "download_count": book[7] if book[7] else 0,
            "download_url": f"https://www.gutenberg.org/files/{book[3]}/{book[3]}-0.txt"
        }
        
        return jsonify(book_data)
        
    except Exception as e:
        print("Error fetching book details:", e)
        return jsonify({"error": "Failed to fetch book details"}), 500



# Add an API endpoint to remove books from shelf
@app.route('/api/remove-from-shelf', methods=['DELETE'])
def remove_from_shelf():
    if not session.get('logged_in'):
        return jsonify({"success": False, "message": "Not logged in"}), 401
    
    data = request.get_json()
    book_id = data.get('bookId')
    username = session.get('username')
    
    try:
        # Get the userId
        cursor.execute('SELECT "userId" FROM "PRIVATE"."USERS" WHERE "userUsername" = %s;', (username,))
        user_row = cursor.fetchone()
        
        if user_row is None:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        userId = user_row[0]
        
        # Delete the book from user's shelf
        cursor.execute("""
            DELETE FROM "PRIVATE"."USER_BOOKS" 
            WHERE "userId" = %s AND "bookId" = %s;
        """, (userId, book_id))
        
        conn.commit()
        return jsonify({"success": True, "message": "Book removed from shelf"})
        
    except Exception as e:
        conn.rollback()
        print("Delete error:", e)
        return jsonify({"success": False, "message": "An error occurred"}), 500

if __name__ == '__main__':
    print("🚀 Flask server is starting...")
    app.run(debug=True)
