document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email und Passwort sind erforderlich!");
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 10 Sekunden Timeout

  try {
    const response = await fetch("/api/register.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Serverfehler: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      alert("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Registrierung fehlgeschlagen.");
    }
  } catch (error) {
    clearTimeout(timeoutId); // sicherheitshalber auch hier

    if (error.name === "AbortError") {
      alert("Die Anfrage hat zu lange gedauert (Timeout). Bitte versuche es erneut.");
    } else {
      console.error("Fehler:", error);
      alert("Registrierung fehlgeschlagen. Bitte überprüfe deine Verbindung oder versuche es später erneut.");
    }
  }
});
