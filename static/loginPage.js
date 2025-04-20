//login Page js code
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginBody');
const loginModalClose = document.getElementById('closeModal');
const loginBody = document.getElementById('loginBody');
const cancelBtn = document.getElementById('cancelBtn');
const usernameInput = document.querySelector('input[name="username"]');
const passwordInput = document.querySelector('input[name="password"]');

//Define variable functions above
loginBtn.onclick = function () {
    loginModal.style.display = 'block';
}

loginModalClose.onclick = function () {
    loginModal.style.display = 'none';
}
cancelBtn.onclick = function () {
    loginModal.style.display = 'none';
}



// Handle login page submission
document.querySelector('form').onsubmit = async function (event) {
    event.preventDefault(); // Prevent form from submitting normally
    const username = usernameInput.value;
    const password = passwordInput.value;


    // Send login data to the server (POST request)
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.success) {
            alert('Login successful!');
            loginModal.style.display = 'none'; // Close modal on successful login
            window.location.href = "/myShelf"; // Redirect to the myshelf page if succesful login
            console.log("Redirecting to myShelf page");
        } else {
            alert('Incorrect username or password.');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
};
