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