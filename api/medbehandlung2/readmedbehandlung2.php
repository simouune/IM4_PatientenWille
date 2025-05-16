<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Nicht autorisiert"]);
    exit;
}

require_once '../../system/config.php';

$loggedInUserId = $_SESSION['user_id'];

try {
    // Die frage_id-Werte für den medbehandlung2-Bereich – passe sie bei Bedarf an!
    $relevanteFragen = ['1a', '1b', '1c', '1d'];

    // SQL vorbereiten (Platzhalter dynamisch erstellen)
    $placeholders = implode(',', array_fill(0, count($relevanteFragen), '?'));

    $stmt = $pdo->prepare("
        SELECT frage_id, antwort 
        FROM antworten 
        WHERE benutzer_id = ?
        AND frage_id IN ($placeholders)
    ");

    // Parameter zusammenführen: zuerst benutzer_id, dann die frage_ids
    $params = array_merge([$loggedInUserId], $relevanteFragen);
    $stmt->execute($params);

    $antworten = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ergebnis in ein einfaches Mapping umwandeln
    $formatted = [];
    foreach ($antworten as $eintrag) {
        $formatted[$eintrag['frage_id']] = $eintrag['antwort'];
    }

    echo json_encode([
        "status" => "success",
        "antworten" => $formatted
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Datenbankfehler: " . $e->getMessage()]);
}

