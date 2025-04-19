// static/createAccount.js
document.getElementById("createAccountForm").addEventListener("submit", async e => {
  e.preventDefault();
  const username = e.target.username.value;
  const email    = e.target.email.value;
  const password = e.target.password.value;

  try {
    const resp = await fetch("/create-account", {       // <-- note the dash
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await resp.json();
    if (data.success) {
      alert(data.message);
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  } catch(err) {
    console.error(err);
    alert("Server error, try again later");
  }
});

// back‑to‑login button
document.getElementById("backToLoginBtn").onclick = () => {
  window.location.href = "/login";
};
