<?php
session_start();

// Nur eingeloggte Benutzer dürfen antworten speichern
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Nicht autorisiert"]);
    exit;
}

// DB-Verbindung
require_once '../../system/config.php'; // Pfad ggf. anpassen

// Eingeloggte Benutzer-ID
$loggedInUserId = $_SESSION['user_id'];

// Rohdaten aus dem JS (JSON POST)
$input = json_decode(file_get_contents('php://input'), true);

// Sicherheitscheck
if (!isset($input['frage_id']) || !isset($input['antwort'])) {
    http_response_code(400);
    echo json_encode(["error" => "Ungültige Eingabe"]);
    exit;
}

$frageId = $input['frage_id'];
$antwort = $input['antwort'] ? 1 : 0; // Boolean zu 0/1

// Daten speichern
try {
    $stmt = $pdo->prepare("
        INSERT INTO antworten (benutzer_id, frage_id, antwort)
        VALUES (:user_id, :frage_id, :antwort)
        ON DUPLICATE KEY UPDATE antwort = :antwort
    ");

    $stmt->execute([
        ':user_id' => $loggedInUserId,
        ':frage_id' => $frageId,
        ':antwort' => $antwort,
    ]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB-Fehler: " . $e->getMessage()]);
}
?>