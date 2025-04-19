//login Page js code
const loginForm = document.getElementById("loginForm");
loginForm.onsubmit = async e => {
  e.preventDefault();
  const username = e.target.uname.value;
  const password = e.target.psw.value;

  try {
    const resp = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const result = await resp.json();
    if (result.success) {
      // store for future API calls
      localStorage.setItem("currentUser", username);
      window.location.href = "/myShelf";
    } else {
      alert("Invalid username or password");
    }
  } catch(err) {
    console.error(err);
    alert("Login error, try again");
  }
};

