CREATE DATABASE IF NOT EXISTS inventory_management;
USE inventory_management;

CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data
INSERT INTO inventory (name, quantity, price) VALUES
('Laptop', 10, 999.99),
('Smartphone', 25, 499.99),
('Headphones', 50, 79.99),
('Keyboard', 30, 59.99),
('Mouse', 40, 29.99);
