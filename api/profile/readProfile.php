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

// Eingeloggte User-ID
$loggedInUserId = $_SESSION['user_id'];

// Profildaten + E-Mail-Adresse abrufen
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

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "user" => $user
    ]);
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(["error" => "User not found"]);
}
?>
