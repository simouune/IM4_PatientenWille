<?php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSON-Daten einlesen
    $input = json_decode(file_get_contents("php://input"), true);

    // E-Mail und Passwort extrahieren
    $email = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');

    // Validierung
    if (!$email || !$password) {
        echo json_encode([
            "status" => "error",
            "message" => "Email und Passwort sind erforderlich"
        ]);
        exit;
    }

    // Prüfen, ob die E-Mail bereits existiert
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode([
            "status" => "error",
            "message" => "Email ist bereits vergeben"
        ]);
        exit;
    }

    // Passwort hashen
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Benutzer in DB einfügen
    $insert = $pdo->prepare("INSERT INTO users (email, password) VALUES (:email, :password)");
    $success = $insert->execute([
        ':email' => $email,
        ':password' => $hashedPassword,
    ]);

    if ($success) {
        // Get the new user's ID
        $userId = $pdo->lastInsertId();

        // Insert an empty profile for the new user
        $insertProfile = $pdo->prepare("INSERT INTO user_profiles (user_id) VALUES (:user_id)");
        $insertProfile->execute([':user_id' => $userId]);

        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Fehler beim Registrieren des Benutzers"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Ungültige Anfrage"
    ]);
}
