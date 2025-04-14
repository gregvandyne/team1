from flask import Flask 
from flask import render_template


app = Flask(__name__)

# Home page route
@app.route('/')
def home():
    return render_template('index.html')

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

# Login page route
@app.route('/loginPage')
def loginPage():
    return render_template('loginPage.html')

# Creating Account page route
@app.route('/createAccount')
def createAccount():
    return render_template('createAccount.html')