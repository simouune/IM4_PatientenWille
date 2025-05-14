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

// Logged-in user ID
$loggedInUserId = $_SESSION['user_id'];

// Read JSON input from fetch request
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['firstname']) || !isset($input['lastname']) || !isset($input['birthdate']) || !isset($input['street']) || !isset($input['postcode']) || !isset($input['city']) || !isset($input['phone'])) {
    http_response_code(400);
    echo json_encode(["error" => "Wir brauchen die Ihre vollständigen Angaben."]);
    exit;
}

$firstname = trim($input['firstname']);
$lastname = trim($input['lastname']);
$birthdate = trim($input['birthdate']);
$street = trim($input['street']);
$postcode = trim($input['postcode']);
$city = trim($input['city']);  
$phone = trim($input['phone']);


// Update the user's profile in the database
$stmt = $pdo->prepare("UPDATE user_profiles SET firstname = :firstname, lastname = :lastname, birthdate = :birthdate, street = :street, postcode = :postcode, city = :city, phone = :phone WHERE user_id = :user_id");
$stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
$stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
$stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
$stmt->bindParam(':birthdate', $birthdate, PDO::PARAM_STR);
$stmt->bindParam(':street', $street, PDO::PARAM_STR);
$stmt->bindParam(':postcode', $postcode, PDO::PARAM_STR);
$stmt->bindParam(':city', $city, PDO::PARAM_STR);
$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);


try {
    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Profile updated."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
