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

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(["error" => "Ungültige Datenstruktur: Array erwartet."]);
    exit;
}

// Beispielhafte Überprüfung, dass jedes Element frage_id und antwort enthält
foreach ($input as $eintrag) {
    if (!isset($eintrag['frage_id']) || !isset($eintrag['antwort'])) {
        http_response_code(400);
        echo json_encode(["error" => "Jedes Antwort-Objekt muss frage_id und antwort enthalten."]);
        exit;
    }
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        UPDATE antworten 
        SET antwort = :antwort
        WHERE benutzer_id = :user_id AND frage_id = :frage_id
    ");

    foreach ($input as $eintrag) {
        if (!isset($eintrag['frage_id'], $eintrag['antwort'])) continue;

        $stmt->execute([
            ':user_id' => $loggedInUserId,
            ':frage_id' => $eintrag['frage_id'],
            ':antwort' => $eintrag['antwort'],
        ]);
    }

    $pdo->commit();
    echo json_encode(["success" => true]);
    exit;

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "DB-Fehler: " . $e->getMessage()]);
    exit;
}
