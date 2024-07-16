const usersTable = `
CREATE TABLE IF NOT EXISTS users (
    id int AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'client', 'lawyer', 'admin') DEFAULT 'user',
    reset_password_token VARCHAR(255),
    reset_password_token_expiration TIMESTAMP NULL DEFAULT NULL,
    password_changed_at TIMESTAMP NULL DEFAULT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const lawyersTable = `
CREATE TABLE IF NOT EXISTS lawyer_profiles(
    id int AUTO_INCREMENT PRIMARY KEY,
    user_id int NOT NULL UNIQUE,
    license_number VARCHAR(255),
    bio TEXT,
    experience int,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    city VARCHAR(100),
    region VARCHAR(100),
    rating int,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id)
);
`;

const specializationsTable = `
CREATE TABLE IF NOT EXISTS specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
`;

const lawyerSpecializationsTable = `
CREATE TABLE IF NOT EXISTS lawyer_specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lawyer_id INT NOT NULL,
    specialization_id INT NOT NULL,
    FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (specialization_id) REFERENCES specializations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_specialization (lawyer_id, specialization_id),
    INDEX (lawyer_id),
    INDEX (specialization_id)
);
`;

const clientProfilesTable = `
CREATE TABLE IF NOT EXISTS client_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id int,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id)
    );
`;

const casesTable = `
    CREATE TABLE IF NOT EXISTS cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id int,
    lawyer_id int,
    description text,
    status ENUM("open", "closed", "pending") DEFAULT "open",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE SET NULL,
    INDEX (client_id),
    INDEX (lawyer_id)
    );
`;

const reviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id int,
    lawyer_id int NOT NULL,
    review_text text,
    rating int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    INDEX (client_id),
    INDEX (lawyer_id)
    );
`;

const messagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id int,
    lawyer_id int,
    message text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE SET NULL,
    INDEX (client_id),
    INDEX (lawyer_id)
    );
`;

export {
  usersTable,
  lawyersTable,
  lawyerSpecializationsTable,
  specializationsTable,
  casesTable,
  clientProfilesTable,
  messagesTable,
  reviewsTable,
};
