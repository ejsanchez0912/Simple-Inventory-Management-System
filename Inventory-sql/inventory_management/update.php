<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['name']) || !isset($data['quantity']) || !isset($data['price'])) {
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    try {
        $id = $data['id'];
        $name = $data['name'];
        $quantity = (int)$data['quantity'];
        $price = (float)$data['price'];
        
        $query = "UPDATE inventory SET name = :name, quantity = :quantity, price = :price WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':price', $price);
        
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Item updated successfully']);
        } else {
            echo json_encode(['error' => 'Failed to update item']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
