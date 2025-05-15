<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../../system/config.php';

$loggedInUserId = $_SESSION['user_id'];

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['leben'], $input['lebensqualitaet'], $input['sterben'], $input['behandlung'])) {
    http_response_code(400);
    echo json_encode(["error" => "Alle vier Antworten (leben, lebensqualitaet, sterben, behandlung) müssen übermittelt werden."]);
    exit;
}

$fragen = [
    101 => $input['leben'],
    102 => $input['lebensqualitaet'],
    103 => $input['sterben'],
    104 => $input['behandlung']
];

try {
    $stmt = $pdo->prepare("
        INSERT INTO antworten (benutzer_id, frage_id, antwort)
        VALUES (:user_id, :frage_id, :antwort)
        ON DUPLICATE KEY UPDATE antwort = :antwort
    ");

    foreach ($fragen as $frage_id => $antwort) {
        $stmt->execute([
            ':user_id' => $loggedInUserId,
            ':frage_id' => $frage_id,
            ':antwort' => $antwort // je nach Typ: int oder string
        ]);
    }

    echo json_encode(["success" => true, "message" => "Antworten wurden aktualisiert."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
