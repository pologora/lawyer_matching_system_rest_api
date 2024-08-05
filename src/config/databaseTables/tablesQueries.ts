const usersTable = `
CREATE TABLE IF NOT EXISTS User (
    userId int AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    googleId VARCHAR(255),
    role ENUM('user', 'client', 'lawyer', 'admin') DEFAULT 'user',
    profileImageFileName VARCHAR(255),
    resetPasswordToken VARCHAR(255),
    resetPasswordTokenExpiration TIMESTAMP NULL DEFAULT NULL,
    passwordChangedAt TIMESTAMP NULL DEFAULT NULL,
    emailVerificationToken VARCHAR(255),
    emailVerificationTokenExpiration TIMESTAMP NULL DEFAULT NULL,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const lawyersTable = `
CREATE TABLE IF NOT EXISTS LawyerProfile(
    lawyerProfileId int AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL UNIQUE,
    licenseNumber VARCHAR(255),
    bio TEXT,
    experience int,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    cityId int,
    regionId int,
    rating DECIMAL(2,1),
    initialConsultationFee DECIMAL(8,2),
    hourlyRate DECIMAL(8,2),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (cityId) REFERENCES City(cityId) ON DELETE SET NULL,
    FOREIGN KEY (regionId) REFERENCES Region(regionId) ON DELETE SET NULL,
    INDEX (userId)
);
`;

const specializationsTable = `
CREATE TABLE IF NOT EXISTS Specialization (
    specializationId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
`;

const lawyerSpecializationsTable = `
CREATE TABLE IF NOT EXISTS LawyerSpecialization (
    lawyerSpecializationId INT AUTO_INCREMENT PRIMARY KEY,
    lawyerId INT NOT NULL,
    specializationId INT NOT NULL,
    FOREIGN KEY (lawyerId) REFERENCES LawyerProfile(lawyerProfileId) ON DELETE CASCADE,
    FOREIGN KEY (specializationId) REFERENCES Specialization(specializationId) ON DELETE CASCADE,
    UNIQUE KEY uniqueSpecialization (lawyerId, specializationId),
    INDEX (lawyerId),
    INDEX (specializationId)
);
`;

const clientProfilesTable = `
CREATE TABLE IF NOT EXISTS ClientProfile (
    clientProfileId INT AUTO_INCREMENT PRIMARY KEY,
    userId int,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    INDEX (userId)
    );
`;

const casesTable = `
CREATE TABLE IF NOT EXISTS \`Case\` (
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
`;

const reviewsTable = `
CREATE TABLE IF NOT EXISTS Review (
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    clientId int,
    lawyerId int NOT NULL,
    reviewText text,
    rating int,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clientId) REFERENCES ClientProfile(clientProfileId) ON DELETE SET NULL,
    FOREIGN KEY (lawyerId) REFERENCES LawyerProfile(lawyerProfileId) ON DELETE CASCADE,
    INDEX (clientId),
    INDEX (lawyerId)
    );
`;

const messagesTable = `
CREATE TABLE IF NOT EXISTS Message (
    messageId INT AUTO_INCREMENT PRIMARY KEY,
    senderId int,
    receiverId int,
    caseId int,
    message text,
    type ENUM ('private', 'public'),
    isRead BOOLEAN,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES User(userId) ON DELETE SET NULL,
    FOREIGN KEY (receiverId) REFERENCES User(userId) ON DELETE SET NULL,
    FOREIGN KEY (caseId) REFERENCES \`Case\`(caseId) ON DELETE SET NULL,
    INDEX (senderId),
    INDEX (receiverId)
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
