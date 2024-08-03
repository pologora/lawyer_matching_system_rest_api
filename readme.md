# Lawyer Matching Service ( REST API documentation )

## Content

1. [Description](#description)
2. [Project Management](#project-management)
3. [Technical Requirements](#technical-requirements)
4. [Installation]()
5. [Database Schema](#database-schema-design)
6. [Error Handling](#error-handling)
7. [Security](#security)
8. [JWT](#jwt)
9. [Base URL](#base-url)
10. [API Documentation](#api-documentation)

    - [Authentication](#authentication)

      - [Login](#login)
      - [Register](#register)
      - [Forgot Password](#forgot-password)
      - [Reset Password](#reset-password)
      - [Change My Password](#change-my-password)
      - [Delete Me](#delete-me)
      - [Logout](#logout)
      - [Verify Email](#verify-email)

    - [Users](#users)

      - [Get Many Users](#get-many-users)
      - [Create User](#create-user)
      - [Get User By ID](#get-user-by-id)
      - [Update User](#update-user)
      - [Delete User](#delete-user)
      - [Upload User Photo](#upload-user-photo)

    - [Lawyer Profile](#Lawyers)

      - [Create Profile Lawyer](#create-lawyer-profile)
      - [Get Lawyer Profile By ID](#get-lawyer-profile-by-id)
      - [Get Many Lawyer Profiles](#get-all-lawyers)
      - [Update Lawyer Profile](#update-lawyer)
      - [Delete Lawyer Profile](#delete-lawyer)

    - [Cases](#cases)

      - [Create Case](#create-case)
      - [Get Case by ID](#get-case-by-id)
      - [Update Case](#update-case)
      - [Delete Case](#delete-case)

    - [Reviews](#reviews)
      - [Create Review](#create-review)
      - [Get Reviews by Lawyer ID](#get-reviews-by-lawyer-id)
      - [Update Review](#update-review)
      - [Delete Review](#delete-review)
    - [Messages](#messages)
      - [Send Message](#send-message)
      - [Get Messages by User ID](#get-messages-by-user-id)

## Description

Platform to match clients with lawyers. When a client has a legal issue, the system suggests available lawyers based on the nature of the case and the lawyer's hourly rate. Ratings and reviews help the client choose a lawyer.

- **Landing Page**: Users can search for lawyers by region, city, and specialization without needing to register.
- **Search Results**: Users view lawyer profiles and can apply additional filters and sorting options.
- **Account Creation**: To interact with a lawyer, users must create an account to initiate a Case.
- **Case Types**: Cases can be either private (directly to a specific lawyer) or public (visible to all lawyers).
- **Messaging**: Communication between the lawyer and client occurs exclusively through the case.
- **Lawyer Proposals**: Lawyers can leave messages in public cases to make proposals to clients.
- **Client Messaging**: Clients can initiate private messaging with lawyers within a case.
- **Case Privacy**: If a client selects a lawyer, the case is made private for that lawyer.
- **Reviews and Ratings**: Once a case is completed, clients can leave a review and rating. Reviews are linked to the case for credibility.

## Project Management

GitHub projects used to track tasks and progress. Please visit [Project Board](https://github.com/users/pologora/projects/5/views/1)

## Core Features:

- User Registration and Authentication (clients and lawyers)
- Profile Management (for both clients and lawyers)
- Case Posting by Clients
- Lawyer Search based on Case Type, City, Region, Hourly Rate
- Ratings and Reviews System
- Messaging System for Client-Lawyer Communication
- Admin Dashboard for Monitoring and Management

## Technical requirements

- Backend:

  - Programming language - `Typescript`
  - API development - `Node.js` with `Express`
  - Database - `MariaDB` (fork of the MySQL)

- Frontend:
  - Programming language -`Typescript`
  - Framework - `React`
  - Component Library - `Chakra UI`

## Installation

### Clone the Project

```bash
git clone https://github.com/pologora/lawyer_matching_system_rest_api.git
```

### Install dependencies

```Bash
npm install
```

## Running the Application

### Docker Setup

1. **Install docker:** Ensure Docker is installed on your machine. You can follow the installation instructions on [the official Docker website](https://www.docker.com/).

2. **Configuration:**

- Rename `env.dev.example` to `.env.dev` and adjust the variables as needed. The database configuration variables are already set for the Docker MariaDB database.

- Rename `env.dev.example` to `.env.prod.` Ensure all necessary variables are set for the application to function properly in the production environment.

### Development Enviroment

To run the application in development mode:

```Bash
docker-compose -f docker-compose.dev.yml up --build
```

The application will be accessible at `http://localhost:8000/api/v1`

### Production Enviroment

To run the application in production mode:

```Bash
docker-compose -f docker-compose.prod.yml up --build
```

The application will be accessible at `http://localhost:5000/api/v1`

## Database Schema Design

[Database Schema](https://online.visual-paradigm.com/community/share/lawyer-matching-system)

![Screenshot](https://github.com/pologora/lawyer_matching_system_rest_api/blob/screenshots/public/screenshots/database_schema.png)

### Tables:

- **User**:

  - `userId` int primary key,
  - `email` varchar unique not null,
  - `password` varchar,
  - `googleId` varchar,
  - `role` enum ('admin', 'user', 'client', 'lawyer') default 'user',
  - `profileImagePath` varchar,
  - `resetPasswordToken` varchar,
  - `resetPasswordTokenExpiration` timestamp,
  - `passwordChangedAt` timestamp,
  - `emailVerificationToken` varchar,
  - `emailVerificationTokenExpiration` timestamp,
  - `active` boolean default `true`,
  - `createdAt` timestamp default current_timestamp,
  - `updatedAt` timestamp default current_timestamp on update current_timestamp

- **LawyerProfile**:

  - `lawyerProfileId` int primary key,
  - `userId` int not null unique,
  - `licenseNumber` varchar(255),
  - `bio` text,
  - `experience` int,
  - `firstName` varchar(100),
  - `lastName` varchar(100),
  - `city` varchar(100),
  - `region` varchar(100),
  - `rating` decimal(2, 1),
  - `initialConsultationFee` decimal(8, 2) default null,
  - `hourlyRate` decimal(8, 2),
  - `FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE`,
  - `INDEX (userId)`

- **Specialization**:

  - `specializationId` int primary key,
  - `name` varchar not null

- **LawyerSpecialization**:

  - `lawyerSpecializationId` int primary key,
  - `lawyerId` int not null, foreign key (LawyerProfile) on delete cascade,
  - `specializationId` int not null, foreign key (Specialization) on delete cascade,
  - `UNIQUE KEY uniqueSpecialization (lawyerId, specializationId)`,
  - `INDEX (lawyerId)`,
  - `INDEX (specializationId)`

- **ClientProfile**:

  - `clientProfileId` int primary key,
  - `userId` int not null unique, foreign key (User) on delete cascade,
  - `firstName` varchar(100),
  - `lastName` varchar(100),
  - `INDEX (userId)`

- **Case**:

  - `caseId` int primary key,
  - `clientId` int, foreign key (ClientProfile) on delete set null,
  - `lawyerId` int, foreign key (LawyerProfile) on delete set null,
  - `specializationId` int, foreign key (Specialization) on delete set null,
  - `cityId` int, foreign key (City) on delete set null,
  - `regionId` int, foreign key (Region) on delete set null,
  - `description` text,
  - `title` varchar(255),
  - `status` enum('open', 'closed', 'pending') default 'open',
  - `createdAt` timestamp default current_timestamp,
  - `updatedAt` timestamp default current_timestamp on update current_timestamp,
  - `INDEX (clientId)`,
  - `INDEX (lawyerId)`

- **Review**:

  - `reviewId` int primary key,
  - `clientId` int, foreign key (ClientProfile) on delete set null,
  - `lawyerId` int not null, foreign key (LawyerProfile) on delete cascade,
  - `reviewText` text,
  - `rating` int,
  - `createdAt` timestamp default current_timestamp,
  - `updatedAt` timestamp default current_timestamp on update current_timestamp,
  - `INDEX (clientId)`,
  - `INDEX (lawyerId)`

- **Message**:

  - `messageId` int primary key,
  - `senderId` int, foreign key (User) on delete set null,
  - `receiverId` int, foreign key (User) on delete set null,
  - `caseId` int, foreign key (Case) on delete set null,
  - `type` enum('private', 'public'),
  - `isRead` boolean,
  - `message` text,
  - `createdAt` timestamp default current_timestamp,
  - `updatedAt` timestamp default current_timestamp on update current_timestamp,
  - `INDEX (senderId)`,
  - `INDEX (receiverId)`

- **Region**:

  - `regionId` int primary key
  - `name` varchar

- **City**:

  - `cityId` int primary key,
  - `regionId` int foreign key (Region) on delete cascade,
  - `name` varchar

## Error Handling

1. Custom Error Class: `AppError` class is used to create custom error objects with additional properties for better error management.
2. Asynchronous Error Wrapper: `asyncErrorCatch` function wraps asynchronous functions to automatically catch errors and pass them to the global error handler.
3. Global Error Handler: `globalErrorHanler` - The global error handler middleware is used at the end of the app to handle all errors passed down the middleware chain.
4. Uncaught Exceptions: To handle uncaught exceptions, log the error and exit the process.
5. Unhandled Rejections: To handle unhandled promise rejections, log the error and close the server gracefully.
6. The application uses the `winston` library for logging. Errors that are not operational and chosen errors by the developer are saved to files and kept for 14 days.

## Security

The following security measures have been implemented:

- Encrypted passwords and reset password tokens
- Rate limiting
- JWT stored in cookies
- Denial of access after password change
- Body payload size limit in requests
- Security headers with Helmet
- Prepared statements to prevent SQL injections
- Validation of all user inputs to prevent XSS attacks

## JWT

Functions:

- `sign`

Creates a JSON Web Token (JWT) with the given payload, secret, and options.

**Parameters**:

- payload (object): The payload data to be included in the token.
- secret (string): The secret key used for signing the token.
- options (object): Options for the token. Currently supports expiresIn to specify token expiration.

`expiresIn` possible formats are `string` or `number`. As a number, it represents milliseconds. As a string, the last character can be:

- 's' - seconds
- 'm' - minutes
- 'h' - hours
- 'd' - days

**Returns**:

(string): The signed JWT.

**Usage**:

```JavaScript

const options = {expiresIn:'2d'};

const token = sign({payload, secret, options});
```

`verify`

Verifies the authenticity and validity of a JWT.

Parameters:

- `token` (string): The JWT to verify.
- `secret` (string): The secret key used to sign the token.

Returns:

`(object|null)`: The decoded payload if the token is valid and not expired, null otherwise.

**Usage:**

```JavaScript
const decoded = verify({ token, secret });
if (decoded) {
  console.log('Token is valid:', decoded);
} else {
  console.log('Token is invalid or expired.');
}

```

## Base URL

    https://lawyerapi.webdevolek.stronawcal.pl/

## API Documentation

### HTTP Status Code Summary:

|     |                       |                                                                                                            |
| --- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| 200 | OK                    | Everything worked as expected.                                                                             |
| 201 | Created               | The request succeeded, and a new resource was created as a result.                                         |
| 204 | No Content            | There is no content to send for this request, but the headers may be useful.                               |
| 400 | Bad Request           | The server cannot or will not process the request due to something that is perceived to be a client error. |
| 401 | Unathorized           | the client must authenticate itself to get the requested response.                                         |
| 403 | Forbiden              | The client does not have access rights to the content.                                                     |
| 404 | Not Found             | The server cannot find the requested resource.                                                             |
| 429 | Too Many Requests     | The user has sent too many requests in a given amount of time ("rate limiting").                           |
| 500 | Internal Server Error | The server has encountered a situation it does not know how to handle.                                     |

## API Endpoints

### Authentication

#### Login

<details>

- URL: `api/v1/auth/login`
- Method: `POST`
- Description: Login a user and return a `JWT` token

**Request Body:**

```JavaScript
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**

- 200 OK

```JavaScript
{
  "status": "success",
  "message": "User login successfully",
  "token": "JWT",
  "data": {
    "userId": 1,
    "role": "user",
    "email": "john.doe@example.com"
  }
}

```

- 401 Unauthorized

```JavaScript
{
  "status": "error",
  "message": "Email or password is not valid",
}

```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message",
}

```

Validation Error Examples:

| Property   | Validation Rule              | Error Message                         |
| ---------- | ---------------------------- | ------------------------------------- |
| `email`    | Required, valid email format | `Email is required` ,                 |
|            |                              | `Email must be a valid email address` |
| `password` | Required                     | ` Password is required`               |

</details>

#### Register

<details>

- URL: `api/v1/auth/register`
- Method: `POST`
- Description: Register a user and return a `JWT` token

**Request Body:**

```JavaScript
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
}
```

**Response:**

- 201 Created

```JavaScript
{
  "status":"success",
  "message": "User registered successfully",
  "token": "JWT"
}

```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message",
}

```

Validation Error Examples:

| Property          | Validation Rule                 | Error Message                                                 |
| ----------------- | ------------------------------- | ------------------------------------------------------------- |
| `email`           | Required, valid email format    | `Email is required` ,                                         |
|                   |                                 | `Email must be a valid email address`                         |
| `password`        | Required, min length            | `Password is required`,                                       |
|                   |                                 | `Password must be at least ${PASSWORD_MIN_LENGTH} characters` |
| `confirmPassword` | Required, should match password | `Confirm password is required`,                               |
|                   |                                 | `Confirm password does not match password`                    |

</details>

#### Forgot Password

<details>

- URL: `api/v1/auth/forgot-password`
- Method: `POST`
- Description: Validate user `email` and sed a reset password link

**Request Body:**

```JavaScript
{
  "email": "john.doe@example.com"
}
```

**Response:**

- 200 Success

```JavaScript
{
  "status": "success",
  "message": "Reset password link was sent to the user email",
}

```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "There is no user with this email adress"
}
```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message",
}

```

Validation Error Examples:

| Property | Validation Rule              | Error Message                         |
| -------- | ---------------------------- | ------------------------------------- |
| `email`  | Required, valid email format | `Email is required` ,                 |
|          |                              | `Email must be a valid email address` |

</details>

#### Reset Password

<details>

- URL: `api/v1/auth/reset-password/:token`
- Method: `PATCH`
- Description: Validate password reset token, set new password and return a `JWT` token

**Request Body:**

```JavaScript
{
  "password": "newpassword",
  "confirmPassword": "newpassword"
}
```

**Response:**

- 200 Success

```JavaScript
{
  "status": "success",
  "message": "Password has been changed",
  "token": "JWT"
}

```

- 400 Bad Request (Invalid token)

```JavaScript
{
  "status": "error",
  "message": "Error message"
}
```

Invalid Token Error Examples:

| Validation Rule | Error Message                                                            |
| --------------- | ------------------------------------------------------------------------ |
| Valid token     | `Invalid reset password token`                                           |
| Expire time     | `The time limit for changing the password has expired. Please try again` |

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message",
}

```

Validation Error Examples:

| Property          | Validation Rule               | Error Message                                                 |
| ----------------- | ----------------------------- | ------------------------------------------------------------- |
| `password`        | Required, min length          | `Password is required` ,                                      |
|                   |                               | `Password must be at least ${PASSWORD_MIN_LENGTH} characters` |
| `confirmPassword` | Required, must match password | `Confirm password is required`,                               |
|                   |                               | `Confirm password does not match password`                    |

- 500 Internal Server Error

```JavaScript
{
  "status": "error",
  "message": "Password update failed. Please try again later.",
}

```

</details>

#### Change My Password

<details>

- URL: `api/v1/auth/change-my-password`
- Method: `PATCH`
- Description: Validate old password, validate `JWT`, set new password and return a new `JWT` token

**Request Body:**

```JavaScript
{
  "password": "oldPassword",
  "newPassword": "newPassword",
  "confirmNewPassword": "newpassword"
}
```

**Response:**

- 200 Success

```JavaScript
{
  "status": "success",
  "message": "Password has been changed",
  "token": "JWT"
}

```

- 401 Unauthorized (Invalid password)

```JavaScript
{
  "status": "error",
  "message": "Invalid password"
}
```

- 401 Unauthorized (Invalid JWT token)

```JavaScript
{
  "status": "error",
  "message": "Invalid signature"
}
```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message",
}

```

Validation Error Examples:

| Property             | Validation Rule               | Error Message                                                 |
| -------------------- | ----------------------------- | ------------------------------------------------------------- |
| `newPassword`        | Required, min length          | `Password is required`,                                       |
|                      |                               | `Password must be at least ${PASSWORD_MIN_LENGTH} characters` |
| `confirmNewPassword` | Required, must match password | `Confirm password is required`,                               |
|                      |                               | `Confirm password does not match password`                    |
| `password`           | Required                      | `Password is required`                                        |

- 500 Internal Server Error

```JavaScript
{
  "status": "error",
  "message": "Password update failed. Please try again later",
}

```

</details>

#### Delete Me

<details>

- URL: `api/v1/auth/delete-me`
- Method: `PATCH`
- Description: Validate password, validate `JWT`, delete account

**Request Body:**

```JavaScript
{
  "password": "password"
}
```

**Response:**

- 204 No Content

- 401 Unauthorized (Invalid password)

```JavaScript
{
  "status": "error",
  "message": "Invalid password"
}
```

- 401 Unauthorized (Invalid JWT token)

```JavaScript
{
  "status": "error",
  "message": "Invalid signature"
}
```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message",
}

```

Validation Error Examples:

| Property   | Validation Rule | Error Message          |
| ---------- | --------------- | ---------------------- |
| `password` | Required        | `Password is required` |

</details>

#### Verify Email

<details>

- URL: `api/v1/auth/verify-email/:token`
- Method: `POST`
- Description: Verify a user's email using the provided token, update User active column to `true`

**Response:**

- 200 OK

```JavaScript
{
  "status": "success",
  "message": "Email validated successfully"
}
```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Invalid email verification token"
}
```

- 400 Bad Request (Expired Token)

```JavaScript
{
  "status": "error",
  "message": "The time limit for email verification expired. Please register again"
}
```

</details>

#### Logout

<details>

- URL: `api/v1/auth/logout`
- Method: `POST`
- Description: Logout a user by removing the JWT token from cookies

**Response:**

- 200 OK

```JavaScript
{
  "status": "success",
  "message": "User logged out successfully"
}
```

</details>

### Users

#### Create User

<details>

- **URL:** `api/v1/users`
- **Method:** `POST`
- **Description:** Create a new user.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response:**

- 201 Created

```JavaScript
{
  "message": "User created successfully",
  "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 7,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    }
}
```

- 400 Bad Request (Duplicate Entry)

```JavaScript
{
  "status": "error",
  "message": "Duplicate entry 'john.doe@example.com' for key 'email'"
}

```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Confirm password does not match password."
}

```

Validation Error Examples:

Validation Error Examples:

| Property          | Validation Rule                 | Error Message                                                 |
| ----------------- | ------------------------------- | ------------------------------------------------------------- |
| `email`           | Required, valid email format    | `Email is required`,                                          |
|                   |                                 | `Email must be a valid email address`                         |
| `password`        | Required, min length            | `Password is required`,                                       |
|                   |                                 | `Password must be at least ${PASSWORD_MIN_LENGTH} characters` |
| `confirmPassword` | Required, should match password | `Confirm password is required`,                               |
|                   |                                 | `Confirm password does not match password`                    |

</details>

#### Get User by ID

<details>

- **URL**: `api/v1/users/:id`
- **Method**: `GET`
- **Description**: Get details of a user by ID.
- **Parameters**: `userId` (integer): ID of the user.

**Response:**

- 200 OK

```JavaScript
  {
    "userId": 1,
    "email": "mail22@mail.com",
    "googleId": null,
    "role": "user",
    "profileImageFileName": null,
    "resetPasswordToken": null,
    "resetPasswordTokenExpiration": null,
    "passwordChangedAt": null,
    "emailVerificationToken": null,
    "emailVerificationTokenExpiration": null,
    "active": 0,
    "createdAt": "2024-08-03T13:29:28.000Z",
    "updatedAt": "2024-08-03T13:29:44.000Z"
  }
```

- 400 Bad Request

```JavaScript
{
  "message": "Bad request"
}
```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "User id: ${userId} not exists",
}
```

</details>

#### Get Many Users

<details>

- **URL**: `api/v1/users`
- **Method**: `GET`
- **Description**: Get all users.

**Query Parameters:**

- `role` (optional): Filter users by role. Possible values: `admin`, `user`, `client`, `lawyer`.
- `limit` (optional): Limit the number of users returned.
- `page` (optional): Specify the page number for pagination.
- `sort` (optional): Sort users by a specific field.
- `order` (optional): Order of sorting. Possible values: `desc`, `asc`.
- `search` (optional): Search users by email or other searchable fields.
- `active` (optional): Filter users by their active status.
- `columns` (optional): Specify which columns to return in the response.

```plaintext
GET /api/v1/users?role=client&limit=10&page=2&sort=createdAt&order=desc&search=john&active=true&columns=userId,email,role,createdAt
```

**Response:**

- 200 OK

```JavaScript
{
    "status": "success",
    "message": "Users retrieved successfully.",
    "data": [
        {
            "userId": 1,
            "email": "mail22@mail.com",
            "googleId": null,
            "role": "lawyer",
            "active": 0,
            "createdAt": "2024-08-03T13:29:28.000Z",
            "updatedAt": "2024-08-03T13:29:44.000Z",
            "profileImageFileName": null
        },
        {
            "userId": 2,
            "email": "mail@mail.com",
            "googleId": null,
            "role": "client",
            "active": 0,
            "createdAt": "2024-08-03T13:29:36.000Z",
            "updatedAt": "2024-08-03T13:30:05.000Z",
            "profileImageFileName": null
        },
    ]
}

```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message"
}
```

Validation Error Examples:

| Property  | Validation Rule                                                                            | Error Message                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `active`  | Must be a boolean                                                                          | `Active must be a boolean.`                                                                                                          |
| `columns` | Must be a string                                                                           | `Columns must be a string.`                                                                                                          |
| `limit`   | Must be a positive integer                                                                 | `Limit must be a number.`<br>`Limit must be an integer.`<br>`Limit must be a positive number.`                                       |
| `order`   | Must be 'desc' or 'asc'                                                                    | `Order must be one of the following values: desc, asc.`<br>`Order must be a string value.`                                           |
| `page`    | Must be a positive integer                                                                 | `Page must be a number.`<br>`Page must be an integer.`<br>`Page must be a positive number.`                                          |
| `role`    | Must be one of ['admin', 'client', 'lawyer', 'user']                                       | `Role must be one of the following values: admin, client, lawyer, user.`<br>`Role must be a string value.`                           |
| `search`  | Must be a string                                                                           | `Search must be a string.`                                                                                                           |
| `sort`    | Must be one of ['userId', 'email', 'googleId', 'role', 'active', 'createdAt', 'updatedAt'] | `Sort must be one of the following values: userId, email, googleId, role, active, createdAt, updatedAt.`<br>`Sort must be a string.` |

</details>

#### Update User

<details>

- **URL**: `api/v1/users/:id`
- **Method**: `PATCH`
- **Description**: Update details of a user by ID.
- **Parameters**: `userId` (integer): ID of the user.

**Allowed columns:**

- `role`
- `active`

**Request Body**:

```JavaScript
{
  "role": "admin",
  "active": true
}
```

**Response:**

- 200 OK

```JavaScript
{
    "status": "success",
    "message": "User updated successfully.",
    "data": {
        "userId": 2,
        "email": "mail@mail.com",
        "googleId": null,
        "role": "admin",
        "profileImageFileName": null,
        "resetPasswordToken": null,
        "resetPasswordTokenExpiration": null,
        "passwordChangedAt": null,
        "emailVerificationToken": null,
        "emailVerificationTokenExpiration": null,
        "active": 1,
        "createdAt": "2024-08-03T13:29:36.000Z",
        "updatedAt": "2024-08-03T15:23:39.000Z"
    }
}

```

- 400 Bad Request

```JavaScript
{
  "status": "error",
  "message": "\"email\" is not allowed"
}

```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Update. No record found with ID: ${userId}"
}

```

</details>

#### Delete User

<details>

- **URL**: `api/v1/users/:id`
- **Method**: `DELETE`
- **Description**: Delete a user by ID.
- **Parameters**: `userId` (integer): ID of the user.

**Response:**

- 204 No Content

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${userId}"
}

```

</details>

#### Upload User Photo

<details>

- **URL**: `api/v1/users/:id/upload-photo`
- **Method**: `PATCH`
- **Description**: Upload and resize profile photo for user.
- **Parameters**: `userId` (integer): ID of the user.

**Request Body:**

- Content-Type: `multipart/form-data`
- Form Data:
  - `photo` (file): The profile photo to be uploaded.

**Response:**

- 200 OK

```JavaScript
{
    "status": "success",
    "message": "User image uploaded successfully"
}

```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Update. No record found with ID: ${userId}"
}

```

- 400 Bad Request

```JavaScript
{
  "status": "error",
  "message": "Not an image! Please upload only images"
}

```

</details>

### Lawyer Profile

#### Create Lawyer Profile

<details>

- **URL**: `api/v1/lawyers`
- **Method**: `POST`
- **Description**: Create a new lawyer profile.

**Request Body**:

```JavaScript
{
  "userId": 2,
  "licenseNumber": "12345",
  "bio": "Experienced lawyer in family law.",
  "experience": 10,
  "firstName": "John",
  "lastName": "Doe",
  "cityId": 1,
  "regionId": 2,
  "specializations": [1, 2, 3],
  "initialConsultationFee": 100.00,
  "hourlyRate": 200.00
}

```

| Field                    | Type             | Required | Error Messages                                                                        |
| ------------------------ | ---------------- | -------- | ------------------------------------------------------------------------------------- |
| `bio`                    | string           | Yes      | - 'Bio is required.'<br>- 'Bio must be a string value.'                               |
| `cityId`                 | number           | Yes      | - 'City ID is required.'<br>- 'City ID must be a numeric value.'                      |
| `experience`             | number           | Yes      | - 'Experience is required.'<br>- 'Experience must be a numeric value.'                |
| `firstName`              | string           | Yes      | - 'First name is required.'<br>- 'First name must be a string value.'                 |
| `hourlyRate`             | number           | No       | - 'hourlyRating must be a numeric value.'                                             |
| `initialConsultationFee` | number           | No       | - 'initialConsultationFee must be a numeric value.'                                   |
| `lastName`               | string           | Yes      | - 'Last name is required.'<br>- 'Last name must be a string value.'                   |
| `licenseNumber`          | string           | Yes      | - 'License number is required.'<br>- 'License number must be a string value.'         |
| `regionId`               | number           | Yes      | - 'Region ID is required.'<br>- 'Region ID must be a numeric value.'                  |
| `specializations`        | array of numbers | Yes      | - 'Specializations are required.'<br>- 'Specializations must be an array of numbers.' |
| `userId`                 | number           | Yes      | - 'User ID is required.'<br>- 'User ID must be a numeric value.'                      |

- 400 Bad Request

```JavaScript
{
  "status": "error",
  "message": "error message from table"
}

```

</details>

#### Get Lawyer Profile by ID

<details>

- **URL**: `api/v1/lawyer/:id`
- **Method**: `GET`
- **Description**: Get lawyer profile of a user by ID.
- **Parameters**: `lawyerProfileId` (integer): ID of the lawyer profile.

**Response:**

- 200 OK

```JavaScript
  "lawyerProfileId": 4,
        "userId": 3,
        "licenseNumber": "licenseNumber",
        "bio": "Some bio",
        "experience": 2,
        "firstName": "John",
        "lastName": "Doe",
        "hourlyRate": null,
        "initialConsultationFee": null,
        "rating": null,
        "city": "Bolesławiec",
        "region": "DOLNOŚLĄSKIE",
        "specializations": "Corporate Law,Tax Law,Family Law"
```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: 42",
}
```

</details>

#### Get Many Lawyer Profiles

<details>

- **URL**: `api/v1/lawyers`
- **Method**: `GET`
- **Description**: Get many lawyer profiles.

**Query Parameters:**

### Fields

- `cityId` (optional): Filter by city ID.
- `experienceMax` (optional): Maximum years of experience.
- `experienceMin` (optional): Minimum years of experience.
- `limit` (optional): Limit the number of lawyers returned.
- `order` (optional): Order of sorting. Possible values: `desc`, `asc`.
- `page` (optional): Specify the page number for pagination.
- `ratingMax` (optional): Maximum rating.
- `ratingMin` (optional): Minimum rating.
- `regionId` (optional): Filter by region ID.
- `search` (optional): Search lawyers by name, bio, or other searchable fields.
- `sort` (optional): Sort lawyers by a specific field. Possible values: `experience`, `cityId`, `regionId`, `rating`, `firstName`, `lastName`, `createdAt`, `updatedAt`, `initialConsultationFee`, `hourlyRate`.
- `specialization` (optional): Filter by specialization ID.

```plaintext
GET /api/v1/lawyers?cityId=1&experienceMax=15&experienceMin=5&limit=10&order=desc&page=2&ratingMax=5&ratingMin=3&regionId=2&search=family&sort=experience&specialization=1

```

**Response:**

- 200 OK

```JavaScript
{
    "status": "success",
    "message": "Lawyer profiles retrieved successfully",
    "data": [
        {
            "lawyerProfileId": 4,
            "userId": 3,
            "licenseNumber": "1111",
            "bio": "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem",
            "experience": 2,
            "hourlyRate": null,
            "initialConsultationFee": null,
            "firstName": "John",
            "lastName": "Doe",
            "rating": null,
            "city": "Bolesławiec",
            "region": "DOLNOŚLĄSKIE",
            "specializations": "Family Law,Corporate Law,Tax Law"
        },
        {
            "lawyerProfileId": 5,
            "userId": 1,
            "licenseNumber": "1111",
            "bio": "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem",
            "experience": 2,
            "hourlyRate": null,
            "initialConsultationFee": null,
            "firstName": "John",
            "lastName": "Doe",
            "rating": null,
            "city": "Bolesławiec",
            "region": "DOLNOŚLĄSKIE",
            "specializations": "Family Law,Corporate Law,Tax Law"
        }
    ]
}

```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "Error message"
}
```

| Property         | Validation Rule                    | Error Message                                                                                                                                                                                      |
| ---------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cityId`         | Must be a number                   | `City ID must be a numeric value.`                                                                                                                                                                 |
| `experienceMax`  | Must be a number                   | `Maximum experience must be a numeric value.`                                                                                                                                                      |
| `experienceMin`  | Must be a number                   | `Minimum experience must be a numeric value.`                                                                                                                                                      |
| `limit`          | Must be a number                   | `Limit must be a numeric value.`                                                                                                                                                                   |
| `order`          | Must be 'desc' or 'asc'            | `Order must be either "desc" or "asc".`                                                                                                                                                            |
| `page`           | Must be a number                   | `Page must be a numeric value.`                                                                                                                                                                    |
| `ratingMax`      | Must be a number                   | `Maximum rating must be a numeric value.`                                                                                                                                                          |
| `ratingMin`      | Must be a number                   | `Minimum rating must be a numeric value.`                                                                                                                                                          |
| `regionId`       | Must be a number                   | `Region ID must be a numeric value.`                                                                                                                                                               |
| `search`         | Must be a string                   | `Search must be a string value.`                                                                                                                                                                   |
| `sort`           | Must be one of ALLOWED_SORT_FIELDS | `Sort must be one of the following values: experience, cityId, regionId, rating, firstName, lastName, createdAt, updatedAt, initialConsultationFee, hourlyRate.`<br>`Sort must be a string value.` |
| `specialization` | Must be a number                   | `Specialization ID must be a numeric value.`                                                                                                                                                       |

</details>

#### Update Lawyer Profile

<details>

- **URL**: `api/v1/lawyers/:id`
- **Method**: `PATCH`
- **Description**: Update details of a lawyer profile by ID.
- **Parameters**: `lawyerProfileId` (integer): ID of the lawyer profile.

**Allowed columns:**

- `bio`
- `cityId`
- `experience`
- `firstName`
- `hourlyRate`
- `initialConsultationFee`
- `lastName`
- `licenseNumber`
- `rating`
- `regionId`
- `specializations`

**Request Body**:

```JavaScript
{
  "bio": "New bio ",
}
```

**Response:**

- 200 OK

```JavaScript
{
    "status": "success",
    "message": "Successfully updated lawyer profile",
    "data": {
        "lawyerProfileId": 5,
        "userId": 1,
        "licenseNumber": "1111",
        "bio": "New bio",
        "experience": 2,
        "firstName": "Lina",
        "lastName": "Lee",
        "hourlyRate": null,
        "initialConsultationFee": null,
        "rating": null,
        "city": "Bielawa",
        "region": "KUJAWSKO-POMORSKIE",
        "specializations": "Criminal Law,Real Estate Law"
    }
}

```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: ${lawyerProfileId}",
}

```

- 400 Bad Request

```JavaScript
{
  "status": "error",
  "message": "error message"
}

```

**Validation Error Messages**

| Property                 | Validation Rule             | Error Message                                     |
| ------------------------ | --------------------------- | ------------------------------------------------- |
| `bio`                    | Must be a string            | `Bio must be a string value.`                     |
| `cityId`                 | Must be a number            | `City ID must be a numeric value.`                |
| `experience`             | Must be a number            | `Experience must be a numeric value.`             |
| `firstName`              | Must be a string            | `First name must be a string value.`              |
| `hourlyRate`             | Must be a number            | `hourlyRating must be a numeric value.`           |
| `initialConsultationFee` | Must be a number            | `initialConsultationFee must be a numeric value.` |
| `lastName`               | Must be a string            | `Last name must be a string value.`               |
| `licenseNumber`          | Must be a string            | `License number must be a string value.`          |
| `rating`                 | Must be a number            | `Rating must be a numeric value.`                 |
| `regionId`               | Must be a number            | `Region ID must be a numeric value.`              |
| `specializations`        | Must be an array of numbers | `Specializations must be an array of numbers.`    |

</details>

#### Delete Lawyer Profile

<details>

- **URL**: `api/v1/lawyers/:id`
- **Method**: `DELETE`
- **Description**: Delete a lawyer profile by ID.
- **Parameters**: `lawyerProfileId` (integer): ID of the lawyer profile.

**Response:**

- 204 No Content

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${lawyerProfileId}"
}

```

</details>

### Client Profiles

#### Create Client Profile

<details>

- **URL**: `api/v1/clients`
- **Method**: `POST`
- **Description**: Create a new client profile.

**Request Body:**

```JavaScript
{
  "firstName": "John",
  "lastName": "Doe",
  "userId": 1
}
```

**Response:**

- 201 Created

```JavaScript
{
    "status": "success",
    "message": "Successfully created client profile",
    "data": {
        "userId": 2,
        "clientProfileId": 2,
        "firstName": "John",
        "lastName": "Doe"
    }
}
```

- 400 Bad Request (Validation errors)

```JavaScript
{
  "status": "error",
  "message": "errro message"
}

```

**Validation Error Messages**

### Validation Error Messages

| Property    | Validation Rule  | Error Message                                                     |
| ----------- | ---------------- | ----------------------------------------------------------------- |
| `firstName` | Required, string | `First name is required.`<br>`First name must be a string value.` |
| `lastName`  | Required, string | `Last name is required.`<br>`Last name must be a string value.`   |
| `userId`    | Required, number | `User ID is required.`<br>`User ID must be a numeric value.`      |

</details>

#### Get Client Profile by ID

<details>

- **URL**: `api/v1/clients/:id`
- **Method**: `GET`
- **Description**: Get client profile of a user by ID.
- **Parameters**: `clientProfileId` (integer): ID of the client profile.

**Response:**

- 200 OK

```JavaScript
  {
    "status": "success",
    "message": "Client profile retrieved successfully",
    "data": {
        "userId": 2,
        "clientProfileId": 2,
        "firstName": "John",
        "lastName": "Doe"
    }
}
```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: 42",
}
```

</details>

#### Get Many Client Profiles

<details>

- **URL**: `api/v1/clients`
- **Method**: `GET`
- **Description**: Get many client profiles.

**Response:**

- 200 OK

```JavaScript
 {
    "status": "success",
    "message": "Client profiles retrieved successfully",
    "data": [
        {
            "userId": 2,
            "clientProfileId": 1,
            "firstName": "John",
            "lastName": "Doe"
        },
        {
            "userId": 2,
            "clientProfileId": 2,
            "firstName": "John",
            "lastName": "Doe"
        },
    ]
}
```

</details>

#### Update Client Profile

<details>

- **URL**: `api/v1/clients/:id`
- **Method**: `PATCH`
- **Description**: Update details of a client profile by ID.
- **Parameters**: `clientProfileId` (integer): ID of the client profile.

**Allowed columns:**

- `firstName`
- `lastName`

**Request Body**:

```JavaScript
{
  "firstName": "Jane",
  "lastName": "Doe"
}

```

**Response:**

- 200 OK

```JavaScript
{
    "status": "success",
    "message": "Successfully updated client profile",
    "data": {
        "userId": 2,
        "clientProfileId": 2,
        "firstName": "Jane",
        "lastName": "Doe"
    }
}

```

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: ${clientProfileId}",
}

```

- 400 Bad Request

```JavaScript
{
  "status": "error",
  "message": "error message"
}

```

**Validation Error Messages**

| Property    | Validation Rule | Error Message                        |
| ----------- | --------------- | ------------------------------------ |
| `firstName` | string          | `First name must be a string value.` |
| `lastName`  | string          | `Last name must be a string value.`  |

</details>

#### Delete Client Profile

<details>

- **URL**: `api/v1/lawyers/:id`
- **Method**: `DELETE`
- **Description**: Delete a lawyer profile by ID.
- **Parameters**: `lawyerProfileId` (integer): ID of the lawyer profile.

**Response:**

- 204 No Content

- 404 Not Found

```JavaScript
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${lawyerProfileId}"
}

```

</details>
