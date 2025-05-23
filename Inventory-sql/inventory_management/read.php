<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include_once '../config/database.php';

try {
    $query = "SELECT * FROM inventory ORDER BY id DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $items = [];
    while ($row = $stmt->fetch()) {
        $items[] = $row;
    }
    
    echo json_encode($items);
} catch (PDOException $e) {    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
