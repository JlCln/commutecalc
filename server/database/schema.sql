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
('Central Station', 48.8566, 2.3522),
('North Terminal', 48.8606, 2.3376),
('South Station', 48.8496, 2.3442),
('East Stop', 48.8589, 2.3622),
('West Terminal', 48.8566, 2.3412),
('Airport Express', 48.8619, 2.3510),
('Business District', 48.8914, 2.2385),
('University Campus', 48.8470, 2.3464),
('Shopping Center', 48.8757, 2.3287),
('Tech Park', 48.8868, 2.3084);

INSERT INTO commute_record (user_id, start_stop_id, end_stop_id, departure_time, average_duration_minutes, days_of_week) VALUES
(1, 1, 2, '08:00:00', 30, 'MON,TUE,WED,THU,FRI'),
(2, 3, 4, '09:00:00', 25, 'MON,WED,FRI');