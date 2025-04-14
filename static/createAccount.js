document.getElementById("createAccountForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the input values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send the data to the backend (server.js)
    try {
        const response = await fetch("/create-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        //return success message
        if (data.success) {
            alert("Account created successfully!");
            window.location.href = "/login"; // Redirect to the login page
            console.log("Redirecting to /login page")
        }

        else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Please try again later.");
    }
});


