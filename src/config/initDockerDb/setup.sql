-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS `Case`,
LawyerSpecialization,
Specialization,
Message,
Review,
LawyerProfile,
ClientProfile,
`User`;

-- Create User table
CREATE TABLE
    IF NOT EXISTS `User` (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255),
        googleId VARCHAR(255),
        role ENUM ('user', 'client', 'lawyer', 'admin') DEFAULT 'user',
        profileImageFileName VARCHAR(255),
        resetPasswordToken VARCHAR(255),
        resetPasswordTokenExpiration TIMESTAMP NULL DEFAULT NULL,
        passwordChangedAt TIMESTAMP NULL DEFAULT NULL,
        emailVerificationToken VARCHAR(255),
        emailVerificationTokenExpiration TIMESTAMP,
        active BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Create LawyerProfile table
CREATE TABLE
    IF NOT EXISTS LawyerProfile (
        lawyerProfileId INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        licenseNumber VARCHAR(255),
        bio TEXT,
        experience INT,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        city VARCHAR(100),
        region VARCHAR(100),
        rating DECIMAL(2, 1),
        FOREIGN KEY (userId) REFERENCES `User` (userId) ON DELETE CASCADE,
        INDEX (userId)
    );

-- Create Specialization table
CREATE TABLE
    IF NOT EXISTS Specialization (
        specializationId INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

-- Create LawyerSpecialization table
CREATE TABLE
    IF NOT EXISTS LawyerSpecialization (
        lawyerSpecializationId INT AUTO_INCREMENT PRIMARY KEY,
        lawyerId INT NOT NULL,
        specializationId INT NOT NULL,
        FOREIGN KEY (lawyerId) REFERENCES LawyerProfile (lawyerProfileId) ON DELETE CASCADE,
        FOREIGN KEY (specializationId) REFERENCES Specialization (specializationId) ON DELETE CASCADE,
        UNIQUE KEY uniqueSpecialization (lawyerId, specializationId),
        INDEX (lawyerId),
        INDEX (specializationId)
    );

-- Create ClientProfile table
CREATE TABLE
    IF NOT EXISTS ClientProfile (
        clientProfileId INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        FOREIGN KEY (userId) REFERENCES `User` (userId) ON DELETE CASCADE,
        INDEX (userId)
    );

-- Create Case table
CREATE TABLE
    IF NOT EXISTS `Case` (
        caseId INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT,
        lawyerId INT,
        specializationId INT,
        cityId INT,
        regionId INT,
        description TEXT,
        title VARCHAR(255),
        status ENUM ('open', 'closed', 'pending') DEFAULT 'open',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (clientId) REFERENCES ClientProfile (clientProfileId) ON DELETE SET NULL,
        FOREIGN KEY (lawyerId) REFERENCES LawyerProfile (lawyerProfileId) ON DELETE SET NULL,
        FOREIGN KEY (specializationId) REFERENCES Specialization (specializationId) ON DELETE SET NULL,
        FOREIGN KEY (cityId) REFERENCES City (cityId) ON DELETE SET NULL,
        FOREIGN KEY (regionId) REFERENCES Region (regionId) ON DELETE SET NULL,
        INDEX (clientId),
        INDEX (lawyerId)
    );

-- Create Review table
CREATE TABLE
    IF NOT EXISTS Review (
        reviewId INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT,
        lawyerId INT NOT NULL,
        reviewText TEXT,
        rating INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (clientId) REFERENCES ClientProfile (clientProfileId) ON DELETE SET NULL,
        FOREIGN KEY (lawyerId) REFERENCES LawyerProfile (lawyerProfileId) ON DELETE CASCADE,
        INDEX (clientId),
        INDEX (lawyerId)
    );

-- Create Message table
CREATE TABLE
    IF NOT EXISTS Message (
        messageId INT AUTO_INCREMENT PRIMARY KEY,
        senderId INT,
        receiverId INT,
        message TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES User (userId) ON DELETE SET NULL,
        FOREIGN KEY (receiverId) REFERENCES User (userId) ON DELETE SET NULL,
        INDEX (senderId),
        INDEX (receiverId)
    );

-- Insert initial data into Specialization table
INSERT INTO
    Specialization (name)
VALUES
    ('Family Law'),
    ('Criminal Law'),
    ('Corporate Law'),
    ('Labor Law'),
    ('Tax Law'),
    ('Real Estate Law'),
    ('Intellectual Property Law'),
    ('Environmental Law'),
    ('Immigration Law'),
    ('Personal Injury Law'),
    ('Bankruptcy Law'),
    ('Civil Rights Law'),
    ('Health Law'),
    ('Elder Law'),
    ('Entertainment Law'),
    ('Sports Law'),
    ('International Law'),
    ('Other');