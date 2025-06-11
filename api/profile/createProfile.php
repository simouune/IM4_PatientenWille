<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Nicht eingeloggt"]);
    exit;
}

require_once '../../system/config.php';

$loggedInUserId = $_SESSION['user_id'];

// JSON-Daten auslesen
$input = json_decode(file_get_contents('php://input'), true);

// Eingaben prüfen
if (
    empty($input['firstname']) ||
    empty($input['lastname']) ||
    empty($input['birthdate']) ||
    empty($input['street']) ||
    empty($input['postcode']) ||
    empty($input['city']) ||
    empty($input['phone'])
) {
    http_response_code(400);
    echo json_encode(["error" => "Alle Felder müssen ausgefüllt sein."]);
    exit;
}

// Eingaben bereinigen
$firstname = trim($input['firstname']);
$lastname = trim($input['lastname']);
$birthdate = trim($input['birthdate']);
$street = trim($input['street']);
$postcode = trim($input['postcode']);
$city = trim($input['city']);
$phone = trim($input['phone']);

try {
    // Prüfen, ob Profil bereits existiert
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM user_profiles WHERE user_id = :user_id");
    $checkStmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
    $checkStmt->execute();
    $exists = $checkStmt->fetchColumn() > 0;

    if ($exists) {
        // Profil aktualisieren
        $updateStmt = $pdo->prepare("
            UPDATE user_profiles
            SET firstname = :firstname,
                lastname = :lastname,
                birthdate = :birthdate,
                street = :street,
                postcode = :postcode,
                city = :city,
                phone = :phone
            WHERE user_id = :user_id
        ");
        $updateStmt->execute([
            ':firstname' => $firstname,
            ':lastname' => $lastname,
            ':birthdate' => $birthdate,
            ':street' => $street,
            ':postcode' => $postcode,
            ':city' => $city,
            ':phone' => $phone,
            ':user_id' => $loggedInUserId
        ]);
        echo json_encode(["success" => true, "message" => "Profil aktualisiert."]);
    } else {
        // Neues Profil anlegen
        $insertStmt = $pdo->prepare("
            INSERT INTO user_profiles (user_id, firstname, lastname, birthdate, street, postcode, city, phone)
            VALUES (:user_id, :firstname, :lastname, :birthdate, :street, :postcode, :city, :phone)
        ");
        $insertStmt->execute([
            ':user_id' => $loggedInUserId,
            ':firstname' => $firstname,
            ':lastname' => $lastname,
            ':birthdate' => $birthdate,
            ':street' => $street,
            ':postcode' => $postcode,
            ':city' => $city,
            ':phone' => $phone
        ]);
        echo json_encode(["success" => true, "message" => "Profil erfolgreich gespeichert."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Datenbankfehler: " . $e->getMessage()]);
}
?>
