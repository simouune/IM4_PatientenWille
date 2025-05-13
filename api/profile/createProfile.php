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
    echo json_encode(["error" => "Eingaben sind erforderlich."]);
    exit;
}
$firstname = trim($input['firstname']);
$lastname = trim($input['lastname']);
$birthdate = trim($input['birthdate']);
$street = trim($input['street']);
$postcode = trim($input['postcode']);
$city = trim($input['city']);
$phone = trim($input['phone']);

// Fetch email from the users table
$emailStmt = $pdo->prepare("SELECT email FROM users WHERE id = :user_id");
$emailStmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
$emailStmt->execute();
$email = $emailStmt->fetchColumn();

if (!$email) {
    http_response_code(500);
    echo json_encode(["error" => "E-Mail konnte nicht abgerufen werden."]);
    exit;
}

// Insert into DB
$stmt = $pdo->prepare("INSERT INTO user_profiles (user_id, email, firstname, lastname) VALUES (:user_id, :email, :firstname, :lastname)");
$stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
$stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
$stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
$stmt->bindParam(':birthdate', $birthdate, PDO::PARAM_STR);
$stmt->bindParam(':street', $street, PDO::PARAM_STR);
$stmt->bindParam(':postcode', $postcode, PDO::PARAM_STR);
$stmt->bindParam(':city', $city, PDO::PARAM_STR);
$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
$stmt->bindParam(':email', $email, PDO::PARAM_STR);

try {
    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Profil erfolgreich eröffnet!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Datenbankfehler: " . $e->getMessage()]);
}


/* AUSKOMMENTIERT
// Get the logged-in user's data
// Fetch the logged-in user's data
$stmt = $pdo->prepare("
    SELECT 
        up.user_id,
        up.firstname,
        up.lastname,
        up.birthdate,
        up.street,
        up.postcode,
        up.city,
        up.phone,
        u.email
    FROM user_profiles up
    JOIN users u ON up.user_id = u.id
    WHERE up.user_id = :user_id
");
$stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
$stmt->execute();

// Insert a new user profile
$insertStmt = $pdo->prepare("
    INSERT INTO user_profiles (user_id, firstname, lastname)
    VALUES (:user_id, :firstname, :lastname)
");
$insertStmt->bindParam(':user_id', $newUserId, PDO::PARAM_INT);
$insertStmt->bindParam(':firstname', $newFirstname, PDO::PARAM_STR);
$insertStmt->bindParam(':lastname', $newLastname, PDO::PARAM_STR);

// Example values for the new user profile
$newUserId = 1;
$newFirstname = 'Benjamin';
$newLastname = 'Hanimann';

$insertStmt->execute();
?>
 */