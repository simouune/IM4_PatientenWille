<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Nicht autorisiert"]);
    exit;
}

require_once '../../system/config.php';

$loggedInUserId = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);

// Prüfen, ob ein Array von Antworten vorliegt
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(["error" => "Ungültige Eingabe"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO antworten (benutzer_id, frage_id, antwort)
        VALUES (:user_id, :frage_id, :antwort)
        ON DUPLICATE KEY UPDATE antwort = :antwort
    ");

    foreach ($input as $eintrag) {
        if (!isset($eintrag['frage_id']) || !isset($eintrag['antwort'])) {
            continue;
        }

        $frageId = trim($eintrag['frage_id']);
        $antwort = trim($eintrag['antwort']);

        // Nur "Ja" oder "Nein" erlauben
        if (!in_array($antwort, ['Ja', 'Nein'], true)) {
            continue;
        }

        $stmt->execute([
            ':user_id' => $loggedInUserId,
            ':frage_id' => $frageId,
            ':antwort' => $antwort,
        ]);
    }

    $pdo->commit();
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "DB-Fehler: " . $e->getMessage()]);
    exit;
}
