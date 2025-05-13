document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Überprüfen, ob Eingabefelder leer sind
    if (!email || !password) {
      alert("Email und Passwort sind erforderlich!");
      return;
    }

    try {
      // Daten im URL-encoded Format senden
      const response = await fetch("api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
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

