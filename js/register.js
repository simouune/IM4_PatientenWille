// register.js
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email und Passwort sind erforderlich!");
    return;
  }

  try {
    const response = await fetch("/api/register.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Registrierung fehlgeschlagen.");
    }
  } catch (error) {
    console.error("Fehler:", error);
    alert("Etwas ist schief gelaufen!");
  }
});
