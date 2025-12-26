USE restaurant_db;

CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  meal VARCHAR(50)
);

INSERT INTO restaurants (name, meal) VALUES
('Pizza Hut', 'pizza'),
('Dominos', 'pizza'),
('Burger King', 'burger'),
('KFC', 'chicken');
