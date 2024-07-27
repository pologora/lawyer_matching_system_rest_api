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
    - [Users](#users)

      - [Get All Users](#get-all-users)
      - [Create User](#create-user)
      - [Get User By ID](#get-user-by-id)
      - [Update User](#update-user)
      - [Delete User](#delete-user)

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

Platform to match clients with lawyers. When a client has a legal issue, the system suggests available lawyers based on the nature of the case and the client's budget. Ratings and reviews help the client choose a lawyer.

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
- Lawyer Search and Matching based on Case Type and Budget
- Lawyer Availability Management
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

[Database Schema](https://drawsql.app/teams/noteam-240/diagrams/lawyer-matching-system)

![Screenshot](https://github.com/pologora/lawyer_matching_system_rest_api/blob/screenshots/public/screenshots/database_schema.png)

### Tables:

- **User**:

  - `userId` int primary key,
  - `email` varchar unique not null,
  - `role` enum ('admin', 'user', 'client', 'lawyer') default 'user',
  - `active` boolean default `true`,
  - `resetPasswordToken` varchar,
  - `resetPasswordTokenExpirations` timestamp,
  - `passwordChangedAt` timestamp,
  - `createdAt` timestamp default current_timestamp,
  - `updatedAt` timestamp default current_timestamp on update current_timestamp

- **LawyerProfile**:

  - `id` int primary key,
  - `userId` foreign key (User) not null unique on delete cascade,
  - `experience` int,
  - `licenseNumber` varchar,
  - `rating` decimal(2,1),
  - `bio` text,
  - `firstName` varchar,
  - `lastName` varchar,
  - `city` varchar,
  - `region` varchar
  - `index (userId)`

- **Specialization**:

  - `specializationId` int primary key,
  - `name` varchar not null

- **LawyerSpecialization**:

  - `lawyerSpecializationId` int primary key,
  - `lawyerId` foreign key (LawyerProfile) not null on delete cascade,
  - `specializationId` foreign key (Specialization) on delete cascade,
  - `uniqueSpecialization` unique key (lawyerId, specializationId),
  - `index (lawyerId)`,
  - `index (specializationId)`

- **ClientProfile**:

  - `clientProfileId` int primary key,
  - `userId` int foreign key (users) not null unique on delete cascade,
  - `firstName` varchar,
  - `lastName` varchar,
  - `index (userId)`

- **Case**:

  - `caseId` int primary key,
  - `clientId` int foreign key (ClientProfile) on delete set null,
  - `lawyerId` int foreign key (LawyerProfile) on delete set null,
  - `description` text,
  - `status` enum ('open', 'closed', 'pending') default open,
  - `createdAt` timestamp default current_timestamp,
  - `updatesAt` timestamp default current_timestamp on update current_timestamp,
  - `index (clientId)`,
  - `index (lawyerId)`

- **Review**:

  - `reviewId` int primary key,
  - `clientId` int foreign key (ClientProfile) on delete set null
  - `lawyerId` int foreign key (LawyerProfile) on delete cascade,
  - `review` text,
  - `rating` int,
  - `index (clientId)`,
  - `index (lawyerId)`

- **Message**:

  - `messageId` int primary key,
  - `senderId` int foreign key (User) on delete set null
  - `receiverId` int foreign key (User) on delete set null,
  - `message` text,
  - `createdAt` timestamp default current_timestamp,
  - `updatesAt` timestamp default current_timestamp on update current_timestamp,
  - `index (senderId)`,
  - `index (receiverId)`

- **Region**:

  - `regionId` int primary key
  - `name` varchar

- **City**:

  - `cityId` int primary key,
  - `regionId` int foreign key,
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

- URL: `api/v1/login`
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

- URL: `api/v1/register`
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

- URL: `api/v1/forgot-password`
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

- URL: `api/v1/reset-password/:token`
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

- URL: `api/v1/change-my-password`
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

- URL: `api/v1/delete-me`
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

### Users

#### Create User

<details>

- **URL:** `api/v1/users`
- **Method:** `POST`
- **Description:** Create a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "client" // or "lawyer"
}
```

**Response:**

- 201 Created

```JavaScript
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "client",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

- 400 Bad Request

```JavaScript
{
  "message": "Validation error"
}
```

</details>

#### Get All Users

<details>

- **URL**: `api/v1/users`
- **Method**: `GET`
- **Description**: Get all users.

**Response:**

- 200 OK

```JavaScript
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "client",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "lawyer",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
]

```

- 400 Bad Request

```JavaScript
{
  "message": "Bad request"
}
```

</details>

#### Get User by ID

<details>

- **URL**: `api/v1/users:id`
- **Method**: `GET`
- **Description**: Get details of a user by ID.
- **Parameters**: id (integer): ID of the user.

**Response:**

- 200 OK

```JavaScript
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "client",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
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
  "message": "User not found"
}
```

</details>

#### Update User

<details>

- **URL**: `api/v1/users:id`
- **Method**: `PATCH`
- **Description**: Update details of a user by ID.
- **Parameters**: id (integer): ID of the user.

**Request Body**:

```JavaScript
{
  "name": "Updated Name",
  "email": "updated.email@example.com",
  "password": "newPassword123"
}
```

**Response:**

- 200 OK

```JavaScript
 {
  "id": 1,
  "name": "Updated Name",
  "email": "updated.email@example.com",
  "role": "client",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
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
  "message": "User not found"
}
```

</details>

#### Delete User

<details>

- **URL**: `api/v1/users:id`
- **Method**: `DELETE`
- **Description**: Delete a user by ID.
- **Parameters**: id (integer): ID of the user.

**Response:**

- 204 No Content

```JavaScript

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
  "message": "User not found"
}
```

</details>
