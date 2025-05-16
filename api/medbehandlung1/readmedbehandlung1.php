<?php

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// DB-Verbindung
require_once '../../system/config.php';

$loggedInUserId = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("
        SELECT frage_id, antwort 
        FROM antworten 
        WHERE benutzer_id = :user_id 
        AND frage_id IN (101, 102, 103, 104)
    ");
    $stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
    $stmt->execute();

    $antworten = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = [
        "leben" => "",
        "lebensqualitaet" => "",
        "sterben" => "",
        "behandlung" => ""
    ];

    foreach ($antworten as $eintrag) {
        switch ($eintrag['frage_id']) {
            case 101:
                $formatted['leben'] = $eintrag['antwort'];
                break;
            case 102:
                $formatted['lebensqualitaet'] = $eintrag['antwort'];
                break;
            case 103:
                $formatted['sterben'] = $eintrag['antwort'];
                break;
            case 104:
                $formatted['behandlung'] = $eintrag['antwort'];
                break;
        }
    }

    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "antworten" => $formatted
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Datenbankfehler: " . $e->getMessage()]);
}












//session_start();


// header('Content-Type: application/json'); // <-- Diese Zeile ergänzen

// if (!isset($_SESSION['user_id'])) {
   //  http_response_code(401);
    // echo json_encode(["error" => "Nicht autorisiert"]);
    // exit;}
// session_start() muss vor dem Setzen des Headers aufgerufen werde

// if (!isset($_SESSION['user_id'])) {
    // http_response_code(401);
    // echo json_encode(["error" => "Nicht autorisiert"]);
   //  exit;}

// require_once '../../system/config.php';

// $loggedInUserId = $_SESSION['user_id'];

// try {
    // $stmt = $pdo->prepare("SELECT frage_id, antwort FROM antworten WHERE benutzer_id = :user_id");
    // $stmt->execute([':user_id' => $loggedInUserId]);

   //  $antworten = $stmt->fetchAll(PDO::FETCH_ASSOC);

 //   echo json_encode(["success" => true, "antworten" => $antworten]);
// } catch (PDOException $e) {
    // http_response_code(500);
   //  echo json_encode(["error" => "DB-Fehler: " . $e->getMessage()]);}
