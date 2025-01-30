CREATE TABLE user (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  avatar_url VARCHAR(255) DEFAULT NULL
);

CREATE TABLE transport_stop (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL
);

CREATE TABLE commute_record (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  start_stop_id INT UNSIGNED NOT NULL,
  end_stop_id INT UNSIGNED NOT NULL,
  departure_time TIME NOT NULL,
  average_duration_minutes INT NOT NULL,
  days_of_week VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (start_stop_id) REFERENCES transport_stop(id),
  FOREIGN KEY (end_stop_id) REFERENCES transport_stop(id)
);

INSERT INTO user (email, password, username) VALUES
('john@example.com', '$2b$10$TEST_HASH', 'john_doe'),
('jane@example.com', '$2b$10$TEST_HASH', 'jane_smith');

INSERT INTO transport_stop (name, latitude, longitude) VALUES
('Gare Centre', 49.2578, 4.0245),
('Gare Champagne-Ardenne TGV', 49.2225, 4.0150),
('Gare de Bezannes', 49.2156, 4.0203),
('Opéra', 49.2526, 4.0305),
('Hôtel de Ville', 49.2575, 4.0323),
('Langlet', 49.2546, 4.0316),
('Vesle', 49.2513, 4.0301),
('Comédie', 49.2534, 4.0307),
('Neufchâtel', 49.2670, 4.0234),
('Bétheny Centre', 49.2778, 4.0375),
('Belges', 49.2603, 4.0299),
('Campus Croix-Rouge', 49.2386, 4.0518),
('CHU Debré', 49.2381, 4.0333),
('Courlancy CHU', 49.2428, 4.0251),
('Saint Thomas', 49.2501, 4.0398),
('Cormontreuil', 49.2333, 4.0544),
('Champ Paveau', 49.2375, 4.0561),
('Tinqueux', 49.2506, 3.9871),
('Saint Brice Courcelles', 49.2611, 3.9933),
('Jean Jaurès', 49.2559, 4.0312),
('Charmeresse', 49.2417, 4.0207),
('Wilson', 49.2467, 4.0283),
('Schneiter', 49.2512, 4.0219),
('Danton', 49.2489, 4.0166),
('Victoire', 49.2541, 4.0343),
('Liberté', 49.2568, 4.0359),
('Roosevelt', 49.2593, 4.0376),
('Pont de Witry', 49.2635, 4.0417),
('Rouget de Lisle', 49.2447, 4.0198),
('Armonville', 49.2434, 4.0231),
('Murigny', 49.2336, 4.0478),
('Pommery', 49.2420, 4.0452),
('Val de Murigny', 49.2317, 4.0436),
('Trois Fontaines', 49.2544, 4.0228),
('Nations', 49.2506, 4.0339),
('Saint-Anne', 49.2575, 4.0347),
('Venise', 49.2469, 4.0431);


INSERT INTO commute_record (user_id, start_stop_id, end_stop_id, departure_time, average_duration_minutes, days_of_week) VALUES
(1, 1, 2, '08:00:00', 30, 'MON,TUE,WED,THU,FRI'),
(2, 3, 4, '09:00:00', 25, 'MON,WED,FRI');