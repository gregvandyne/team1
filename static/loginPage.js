//login Page js code
const loginForm = document.querySelector('#loginForm'); // Adjust this to your form's ID

loginForm.onsubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const resp = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await resp.json();
    console.log(data);  // Log the response from Flask

    if (data.success) {
        // ✅ Redirect to another page
        window.location.href = "/home";  // Change this to your real target route
    } else {
        // ❌ Show error message
        alert(data.message);
    }
};
