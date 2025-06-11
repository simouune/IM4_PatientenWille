<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Nicht eingeloggt"]);
    exit;
}

require_once '../../system/config.php';

$loggedInUserId = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);

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

$firstname = trim($input['firstname']);
$lastname = trim($input['lastname']);
$birthdate = trim($input['birthdate']);
$street = trim($input['street']);
$postcode = trim($input['postcode']);
$city = trim($input['city']);
$phone = trim($input['phone']);

try {
    $stmt = $pdo->prepare("
        UPDATE user_profiles SET
            firstname = :firstname,
            lastname = :lastname,
            birthdate = :birthdate,
            street = :street,
            postcode = :postcode,
            city = :city,
            phone = :phone
        WHERE user_id = :user_id
    ");

    $stmt->execute([
        ':firstname' => $firstname,
        ':lastname' => $lastname,
        ':birthdate' => $birthdate,
        ':street' => $street,
        ':postcode' => $postcode,
        ':city' => $city,
        ':phone' => $phone,
        ':user_id' => $loggedInUserId
    ]);

    echo json_encode(["success" => true, "message" => "Profil erfolgreich aktualisiert."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Datenbankfehler: " . $e->getMessage()]);
}
?>
