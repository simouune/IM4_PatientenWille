// login.js
console.log("Login script loaded");
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("/api/login.php", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Login erfolgreich!");
      window.location.href = "uebersicht.html";
    } else {
      alert(result.message || "Login fehlgeschlagen.");
    }
  } catch (error) {
    console.error("Fehler:", error);
    alert("Etwas ist schief gelaufen!");
  }
});
