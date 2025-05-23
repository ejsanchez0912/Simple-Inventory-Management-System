<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['quantity']) || !isset($data['price'])) {
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    try {
        $name = $data['name'];
        $quantity = (int)$data['quantity'];
        $price = (float)$data['price'];
        
        $query = "INSERT INTO inventory (name, quantity, price) VALUES (:name, :quantity, :price)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':price', $price);
        
        if ($stmt->execute()) {
            echo json_encode([
                'message' => 'Item created successfully',
                'id' => $conn->lastInsertId()
            ]);
        } else {
            echo json_encode(['error' => 'Failed to create item']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
