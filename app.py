from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_bcrypt import Bcrypt
import psycopg2

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Database connection
conn = psycopg2.connect(
    dbname="neondb",
    user="neondb_owner",
    password="npg_SJNojOlDZ37x",
    host="ep-dry-wildflower-a8ojs434-pooler.eastus2.azure.neon.tech",
    sslmode="require"
)
cursor = conn.cursor()

# Home page route
@app.route('/home')
def home():
    return render_template('home.html')

# My Shelf page route
@app.route('/myShelf')
def myShelf():
    return render_template('myShelf.html')

# Featured Landing page route
@app.route('/featured')
def featured():
    return render_template('featured.html')

# Featured Collection page route
@app.route('/collection')
def collection():
    return render_template('collection.html')

# Search page route
@app.route('/searchPage')
def searchPage():
    return render_template('searchPage.html')

# Creating Account page route
@app.route('/createAccount', methods=['GET', 'POST'])
def createAccount():
    if request.method == 'GET':
        # Render the Create Account page
        return render_template('createAccount.html')
    
    if request.method == 'POST':
        # Handle account creation
        if request.is_json:
            data = request.get_json()  # Handle JSON data
            username = data['username']
            email = data['email']
            password = data['password']
        else:
            data = request.form  # Handle form-encoded data
            username = data['username']
            email = data['email']
            password = data['password']

        try:
            # Check if username or email exists
            cursor.execute('SELECT * FROM "PRIVATE"."USERS" WHERE "userUsername" = %s OR "userEmail" = %s', (username, email))
            if cursor.fetchone():
                return render_template('createAccount.html', error="Username or email already exists.")

            # Hash the password
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

            # Insert user into the database
            cursor.execute(
                'INSERT INTO "PRIVATE"."USERS" ("userUsername", "userEmail", "userPassword") VALUES (%s, %s, %s)',
                (username, email, hashed_password)
            )
            conn.commit()
            return redirect(url_for('login'))  # Redirect to the login page on success
        except Exception as e:
            print("Error:", e)
            return render_template('createAccount.html', error="Failed to create account.")

# Handle login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        # Render the Login page
        return render_template('loginPage.html')
    
    if request.method == 'POST':
        # Handle login
        if request.is_json:
            data = request.get_json()
            username = data['username']
            password = data['password']
        else:
            data = request.form
            username = data['uname']
            password = data['psw']

        try:
            # Query user from the database
            cursor.execute('SELECT * FROM "PRIVATE"."USERS" WHERE "userUsername" = %s', (username,))
            user = cursor.fetchone()

            if not user or not bcrypt.check_password_hash(user[2], password):
                # Invalid credentials
                return render_template('loginPage.html', error="Invalid username or password.")

            # Successful login
            return redirect(url_for('myShelf'))  # Redirect to the My Shelf page
        except Exception as e:
            print("Error:", e)
            return render_template('loginPage.html', error="Server error. Please try again later.")

if __name__ == '__main__':
    app.run(debug=True)