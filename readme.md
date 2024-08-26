# Lawyer Matching Service ( REST API documentation )

## Content

1. [Description](#description)
2. [Project Management](#project-management)
3. [Technical Requirements](#technical-requirements)
4. [Installation](#installation)
5. [Database Schema](#database-schema-design)
6. [Error Handling](#error-handling)
7. [Security](#security)
8. [JWT](#jwt)
9. [Base URL](#base-url)
10. [API Documentation](#api-documentation)

    - [Authentication](#authentication)

      - [Login](#login)
      - [Register](#register)
      - [Register/Login with Google](#registerlogin-with-google)
      - [Get Me](#get-me)
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
      - [Get Many Lawyer Profiles](#get-many-lawyer-profiles)
      - [Update Lawyer Profile](#update-lawyer)
      - [Delete Lawyer Profile](#delete-lawyer)

    - [Client Profile](#client-profile)

      - [Create Client Profile](#create-client-profile)
      - [Get Client Profile By ID](#get-client-profile-by-id)
      - [Get Many Client Profiles](#get-many-client-profiles)
      - [Update Client Profile](#update-client-profile)
      - [Delete Client Profile](#delete-client-profile)

    - [Cases](#cases)

      - [Create Case](#create-case)
      - [Get Case by ID](#get-case-by-id)
      - [Get Many Cases](#get-many-cases)
      - [Update Case](#update-case)
      - [Delete Case](#delete-case)

    - [Reviews](#reviews)

      - [Create Review](#create-review)
      - [Get Reviews by ID](#get-review-by-id)
      - [Get Many Reviews](#get-many-reviews)
      - [Update Review](#update-review)
      - [Delete Review](#delete-review)

    - [Messages](#messages)

      - [Create Message](#create-message)
      - [Get Messages by ID](#get-message-by-id)
      - [Get Many Messages](#get-many-messages)
      - [Update Message](#update-message)
      - [Delete Message](#delete-message)

    - [Cities](#cities)

      - [Get Cities by Region ID](#get-cities-by-region)

    - [Regions](#regions)

      - [Get all Regions](#get-all-regions)

## Description

Platform to match clients with lawyers. When a client has a legal issue, the system suggests available lawyers based on the nature of the case and the lawyer's hourly rate. Ratings and reviews help the client choose a lawyer.

## Possible User Flow:

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

- User Registration and Authentication by email or Google account (clients and lawyers)
- Email Verification after first registration by email
- Profile Management (for both clients and lawyers)
- Case Posting by Clients
- Lawyer Search based on Case Type, City, Region, Hourly Rate
- Ratings and Reviews System
- Messaging System for Client-Lawyer Communication
- Admin Dashboard for Monitoring and Management

## Technical requirements

- Programming language - `Typescript`
- API development - `Node.js` with `Express`
- Database - `MariaDB` (fork of the MySQL)

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
  - `isVerified` boolean default `false`,
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

In all API endpoints, any unexpected fields in query parameters that are not defined in the schema will result in:

- 400 Bad Request

```json
{
  "status": "error",
  "message": "\"fieldname\" is not allowed"
}
```

If user email is not verified and route is protected will result in:

- 401 Unauthorized

```json
{
  "status": "error",
  "message": "The email is not verified. Please verify your email."
}
```

If route is protected and user is not logged in:

**Response:**

- 401 Unauthorized

```json
{
  "status": "error",
  "message": "You are not logged in. Please log in to get access."
}
```

If route is restricted to role and user don't have privileges:

**Response:**

- 403 Forbidden

```json
{
  "status": "error",
  "message": "User does not have permissions"
}
```

## API Endpoints

### Authentication

#### Login

<details>

- **URL**: `api/v1/auth/login`
- **Method**: `POST`
- **Description**: Login a user and return a `JWT` token

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**

- 200 OK

```json
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

```json
{
  "status": "error",
  "message": "Email or password is not valid"
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Error message"
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

- **URL**: `api/v1/auth/register`
- **Method**: `POST`
- **Description**: Register a user and return a `JWT` token

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**

- 201 Created

```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "JWT"
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Error message"
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

#### Register/Login with Google

<details>

- **URL**: `api/v1/auth/google`
- **Method**: `GET`
- **Description**: Register or login a user with their Google account.

**Response:**

- Assigns JWT token to cookies and redirects the user.

</details>

#### Get Me

<details>

- **URL**: `api/v1/auth/me`
- **Method**: `GET`
- **Description**: Get `user` and `profile` by `JWT` token

**Request Body:**

JWT token in cookies.

**Response:**

- 200 Success

```json
{
  "status": "success",
  "message": "Retrieved user and profile successfully",
  "data": {
    "role": "lawyer",
    "userId": 3,
    "googleId": null,
    "active": 0,
    "email": "mail2@mail.com",
    "createdAt": "2024-08-03T13:29:39.000Z",
    "updatedAt": "2024-08-03T13:30:25.000Z",
    "lawyerProfileId": 4,
    "licenseNumber": "1111",
    "bio": "lorem",
    "experience": 2,
    "firstName": "John",
    "lastName": "Doe",
    "rating": null,
    "city": "Bolesławiec",
    "region": "DOLNOŚLĄSKIE",
    "specializations": "Criminal Law,Real Estate Law"
  }
}
```

- 401 Unauthorized

```json
{
  "status": "error",
  "message": "The user belonging to this token no longer exists. Please log in or create an account"
}
```

</details>

#### Forgot Password

<details>

- **URL**: `api/v1/auth/forgot-password`
- **Method**: `POST`
- **Description**: Validate user `email` and sed a reset password link

**Request Body:**

```json
{
  "email": "john.doe@example.com"
}
```

**Response:**

- 200 Success

```json
{
  "status": "success",
  "message": "Reset password link was sent to the user email"
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "There is no user with this email adress"
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Error message"
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

- **URL**: `api/v1/auth/reset-password/:token`
- **Method**: `PATCH`
- **Description**: Validate password reset token, set new password and return a `JWT` token

**Request Body:**

```json
{
  "password": "newpassword",
  "confirmPassword": "newpassword"
}
```

**Response:**

- 200 Success

```json
{
  "status": "success",
  "message": "Password has been changed",
  "token": "JWT"
}
```

- 400 Bad Request (Invalid token)

```json
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

```json
{
  "status": "error",
  "message": "Error message"
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

```json
{
  "status": "error",
  "message": "Password update failed. Please try again later."
}
```

</details>

#### Change My Password

<details>

- **URL**: `api/v1/auth/change-my-password`
- **Method**: `PATCH`
- **Description**: Validate old password, validate `JWT`, set new password and return a new `JWT` token
- **Protection**: `JWT`

**Request Body:**

```json
{
  "password": "oldPassword",
  "newPassword": "newPassword",
  "confirmNewPassword": "newpassword"
}
```

**Response:**

- 200 Success

```json
{
  "status": "success",
  "message": "Password has been changed",
  "token": "JWT"
}
```

- 401 Unauthorized (Invalid password)

```json
{
  "status": "error",
  "message": "Invalid password"
}
```

- 401 Unauthorized (Invalid JWT token)

```json
{
  "status": "error",
  "message": "Invalid signature"
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Error message"
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

```json
{
  "status": "error",
  "message": "Password update failed. Please try again later"
}
```

</details>

#### Delete Me

<details>

- **URL**: `api/v1/auth/delete-me`
- **Method**: `PATCH`
- **Description**: Validate password, validate `JWT`, delete account
- **Protection**: `JWT`

**Request Body:**

```json
{
  "password": "password"
}
```

**Response:**

- 204 No Content

- 401 Unauthorized (Invalid password)

```json
{
  "status": "error",
  "message": "Invalid password"
}
```

- 401 Unauthorized (Invalid JWT token)

```json
{
  "status": "error",
  "message": "Invalid signature"
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Error message"
}
```

Validation Error Examples:

| Property   | Validation Rule | Error Message          |
| ---------- | --------------- | ---------------------- |
| `password` | Required        | `Password is required` |

</details>

#### Verify Email

<details>

- **URL**: `api/v1/auth/verify-email/:token`
- **Method**: `POST`
- **Description**: Verify a user's email using the provided token, update User active column to `true`

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Email validated successfully"
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Invalid email verification token"
}
```

- 400 Bad Request (Expired Token)

```json
{
  "status": "error",
  "message": "The time limit for email verification expired. Please register again"
}
```

</details>

#### Logout

<details>

- **URL**: `api/v1/auth/logout`
- **Method**: `POST`
- **Description**: Logout a user by removing the JWT token from cookies

**Response:**

- 200 OK

```json
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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`

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

```json
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

```json
{
  "status": "error",
  "message": "Duplicate entry 'john.doe@example.com' for key 'email'"
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Confirm password does not match password."
}
```

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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`

**Response:**

- 200 OK

```json
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
  "isVerified": 0,
  "createdAt": "2024-08-03T13:29:28.000Z",
  "updatedAt": "2024-08-03T13:29:44.000Z"
}
```

- 400 Bad Request

```json
{
  "message": "Bad request"
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "User id: ${userId} not exists"
}
```

</details>

#### Get Many Users

<details>

- **URL**: `api/v1/users`
- **Method**: `GET`
- **Description**: Get all users.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`

**Query Parameters:**

- `role` (optional): Filter users by role. Possible values: `admin`, `user`, `client`, `lawyer`.
- `limit` (optional): Limit the number of users returned.
- `page` (optional): Specify the page number for pagination.
- `sort` (optional): Sort users by a specific field.
- `order` (optional): Order of sorting. Possible values: `desc`, `asc`.
- `search` (optional): Search users by email or other searchable fields.
- `isVerified` (optional): Filter users by their isVerified status.
- `columns` (optional): Specify which columns to return in the response.

```plaintext
GET /api/v1/users?role=client&limit=10&page=2&sort=createdAt&order=desc&search=john&isVerified=true&columns=userId,email,role,createdAt
```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Users retrieved successfully.",
  "data": [
    {
      "userId": 1,
      "email": "mail22@mail.com",
      "googleId": null,
      "role": "lawyer",
      "isVerified": 0,
      "createdAt": "2024-08-03T13:29:28.000Z",
      "updatedAt": "2024-08-03T13:29:44.000Z",
      "profileImageFileName": null
    },
    {
      "userId": 2,
      "email": "mail@mail.com",
      "googleId": null,
      "role": "client",
      "isVerified": 1,
      "createdAt": "2024-08-03T13:29:36.000Z",
      "updatedAt": "2024-08-03T13:30:05.000Z",
      "profileImageFileName": null
    }
  ]
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Error message"
}
```

Validation Error Examples:

| Property     | Validation Rule                                                                            | Error Message                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `isVerified` | Must be a boolean                                                                          | `Active must be a boolean.`                                                                                                          |
| `columns`    | Must be a string                                                                           | `Columns must be a string.`                                                                                                          |
| `limit`      | Must be a positive integer                                                                 | `Limit must be a number.`<br>`Limit must be an integer.`<br>`Limit must be a positive number.`                                       |
| `order`      | Must be 'desc' or 'asc'                                                                    | `Order must be one of the following values: desc, asc.`<br>`Order must be a string value.`                                           |
| `page`       | Must be a positive integer                                                                 | `Page must be a number.`<br>`Page must be an integer.`<br>`Page must be a positive number.`                                          |
| `role`       | Must be one of ['admin', 'client', 'lawyer', 'user']                                       | `Role must be one of the following values: admin, client, lawyer, user.`<br>`Role must be a string value.`                           |
| `search`     | Must be a string                                                                           | `Search must be a string.`                                                                                                           |
| `sort`       | Must be one of ['userId', 'email', 'googleId', 'role', 'active', 'createdAt', 'updatedAt'] | `Sort must be one of the following values: userId, email, googleId, role, active, createdAt, updatedAt.`<br>`Sort must be a string.` |

</details>

#### Update User

<details>

- **URL**: `api/v1/users/:id`
- **Method**: `PATCH`
- **Description**: Update details of a user by ID.
- **Parameters**: `userId` (integer): ID of the user.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`

**Allowed columns:**

- `role`
- `active`

**Request Body**:

```json
{
  "role": "admin",
  "active": true
}
```

**Response:**

- 200 OK

```json
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

```json
{
  "status": "error",
  "message": "\"email\" is not allowed"
}
```

- 404 Not Found

```json
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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`

**Response:**

- 204 No Content

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${userId}"
}
```

</details>

#### Upload User Photo

The `uploadPhoto` route is accessible to all authenticated users. However, users must be logged in to use this route.

**Response:**

- 401 Unauthorized

```json
{
  "status": "error",
  "message": "You are not logged in. Please log in to get access."
}
```

<details>

- **URL**: `api/v1/users/:id/upload-photo`
- **Method**: `PATCH`
- **Description**: Upload and resize profile photo for user.
- **Parameters**: `userId` (integer): ID of the user.
- **Protection**: `JWT`

**Request Body:**

- Content-Type: `multipart/form-data`
- Form Data:
  - `photo` (file): The profile photo to be uploaded.

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "User image uploaded successfully"
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Update. No record found with ID: ${userId}"
}
```

- 400 Bad Request

```json
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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `user`

**Request Body**:

```json
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
  "initialConsultationFee": 100.0,
  "hourlyRate": 200.0
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

```json
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

```json
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

```json
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: 42"
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

```json
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

```json
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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `lawyer`

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

```json
{
  "bio": "New bio "
}
```

**Response:**

- 200 OK

```json
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

```json
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: ${lawyerProfileId}"
}
```

- 400 Bad Request

```json
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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `lawyer`

**Response:**

- 204 No Content

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${lawyerProfileId}"
}
```

</details>

### Client Profile

#### Create Client Profile

<details>

- **URL**: `api/v1/clients`
- **Method**: `POST`
- **Description**: Create a new client profile.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `user`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "userId": 1
}
```

**Response:**

- 201 Created

```json
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

```json
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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `client`
  - `lawyer`

**Response:**

- 200 OK

```json
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

```json
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: 42"
}
```

</details>

#### Get Many Client Profiles

<details>

- **URL**: `api/v1/clients`
- **Method**: `GET`
- **Description**: Get many client profiles.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`

**Response:**

- 200 OK

```json
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
    }
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
- **Protection**: `JWT`
- **Role Restrictions**:
  - `client`

**Allowed columns:**

- `firstName`
- `lastName`

**Request Body**:

```json
{
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response:**

- 200 OK

```json
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

```json
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: ${clientProfileId}"
}
```

- 400 Bad Request

```json
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

- **URL**: `api/v1/clients/:id`
- **Method**: `DELETE`
- **Description**: Delete a client profile by ID.
- **Parameters**: `lawyerProfileId` (integer): ID of the client profile.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `client`

**Response:**

- 204 No Content

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${clientProfileId}"
}
```

</details>

### Cases

#### Create Case

<details>

- **URL:** `api/v1/cases`
- **Method:** `POST`
- **Description:** Create a new case.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `client`

**Request Body:**

```json
{
  "cityId": 1,
  "clientId": 2,
  "description": "Description of the case",
  "lawyerId": 3,
  "regionId": 4,
  "title": "Title of the case"
}
```

**Response:**

- 201 Created

```json
{
  "status": "success",
  "message": "Successfully created new case",
  "data": {
    "caseId": 2,
    "clientId": 2,
    "lawyerId": 5,
    "description": "Description of the case",
    "status": "open",
    "title": "Title of the case",
    "createdAt": "2024-08-04T09:16:54.000Z",
    "updatedAt": "2024-08-04T09:16:54.000Z",
    "region": null,
    "city": "Nowogrodziec"
  }
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Confirm password does not match password."
}
```

**Validation Error Examples**:

| Property | Validation Rule | Error ### Validation Error Messages

| Property      | Validation Rule  | Error Message                                                       |
| ------------- | ---------------- | ------------------------------------------------------------------- |
| `cityId`      | number           | `City ID must be a numeric value.`                                  |
| `clientId`    | required, number | `Client ID is required.`<br>`Client ID must be a numeric value.`    |
| `description` | required, string | `Description is required.`<br>`Description must be a string value.` |
| `lawyerId`    | required, number | `Lawyer ID is required.`<br>`Lawyer ID must be a numeric value.`    |
| `regionId`    | number           | `Region ID must be a numeric value.`                                |
| `title`       | required, string | `Title is required.`<br>`Title must be a string value.`             |

</details>

#### Get Case by Id

<details>

- **URL:** `api/v1/cases/:id`
- **Method:** `GET`
- **Description:** Retrieve details of a case by Id.
- **Parameters:** `caseId`(integer): Id of the case.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `client`
  - `lawyer`

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Case retrieved successfully.",
  "data": {
    "caseId": 1,
    "cityId": 1,
    "clientId": 2,
    "description": "Description of the case",
    "lawyerId": 3,
    "regionId": 4,
    "title": "Title of the case",
    "status": "open",
    "createdAt": "2024-08-03T13:29:28.000Z",
    "updatedAt": "2024-08-03T13:29:28.000Z"
  }
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: ${caseId}"
}
```

</details>

#### Get Many Cases

<details>

- **URL:** `api/v1/cases`
- **Method:** `GET`
- **Description:** Retrieve a list of cases.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `client`
  - `lawyer`

**Query Parameters:**

- `cityId` (optional): Filter by city ID.
- `clientId` (optional): Filter by client ID.
- `lawyerId` (optional): Filter by lawyer ID.
- `limit` (optional): Limit the number of results.
- `order` (optional): Order of sorting. Possible values: `desc`, `asc`.
- `page` (optional): Page number for pagination.
- `regionId` (optional): Filter by region ID.
- `searchDescription` (optional): Search by case description.
- `searchTitle` (optional): Search by case title.
- `sort` (optional): Sort by specific fields. Possible values: `cityId`, `clientId`, `lawyerId`, `regionId`, `createdAt`, `updatedAt`, `title`.
- `specializationId` (optional): Filter by specialization ID.
- `status` (optional): Filter by case status.

**Example Request:**

```plaintext
GET /api/v1/cases?clientId=2&limit=10&page=1&sort=createdAt&order=desc

```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Cases retrieved successfully",
  "data": [
    {
      "caseId": 2,
      "clientId": 2,
      "lawyerId": 5,
      "description": "Case description",
      "status": "open",
      "title": "Very important case 1",
      "createdAt": "2024-08-04T09:16:54.000Z",
      "updatedAt": "2024-08-04T09:17:44.000Z",
      "region": "LUBUSKIE",
      "city": "Nowogrodziec"
    },
    {
      "caseId": 4,
      "clientId": 3,
      "lawyerId": 22,
      "description": "Updated description",
      "status": "closed",
      "title": "Very important case 2",
      "createdAt": "2024-08-04T09:16:54.000Z",
      "updatedAt": "2024-08-04T09:17:44.000Z",
      "region": "LUBUSKIE",
      "city": "Nowogrodziec"
    }
  ]
}
```

- 400 Bad Request

```json
{
  "status": "error",
  "message": "error message"
}
```

**Validation Error Messages:**

| Property            | Validation Rule                    | Error Message                                                                                                                                    |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cityId`            | Must be a number                   | `City ID must be a numeric value.`                                                                                                               |
| `clientId`          | Must be a number                   | `Client ID must be a numeric value.`                                                                                                             |
| `lawyerId`          | Must be a number                   | `Lawyer ID must be a numeric value.`                                                                                                             |
| `limit`             | Must be a number                   | `Limit must be a numeric value.`                                                                                                                 |
| `order`             | Must be 'desc' or 'asc'            | `Order must be either "desc" or "asc".`                                                                                                          |
| `page`              | Must be a number                   | `Page must be a numeric value.`                                                                                                                  |
| `regionId`          | Must be a number                   | `Region ID must be a numeric value.`                                                                                                             |
| `searchDescription` | Must be a string                   | `Search description must be a string value.`                                                                                                     |
| `searchTitle`       | Must be a string                   | `Search title must be a string value.`                                                                                                           |
| `sort`              | Must be one of ALLOWED_SORT_FIELDS | `Sort must be one of the following values: cityId, clientId, lawyerId, regionId, createdAt, updatedAt, title.`<br>`Sort must be a string value.` |
| `specializationId`  | Must be a number                   | `Specialization ID must be a numeric value.`                                                                                                     |
| `status`            | Must be a string                   | `Status must be a string value.`                                                                                                                 |

</details>

#### Update Case

<details>

- **URL**: `api/v1/cases/:id`
- **Method**: `PATCH`
- **Description**: Update details of a case profile by ID.
- **Parameters**: `caseId` (integer): ID of the case.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `client`
  - `lawyer`

**Allowed columns:**

- `cityId`
- `description`
- `regionId`
- `status`

**Request Body**:

```json
{
  "cityId": 1,
  "description": "Updated description of the case",
  "regionId": 4,
  "status": "closed"
}
```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Case updated successfully.",
  "data": {
    "caseId": 1,
    "cityId": 1,
    "clientId": 2,
    "description": "Updated description of the case",
    "lawyerId": 3,
    "regionId": 4,
    "title": "Title of the case",
    "status": "closed",
    "createdAt": "2024-08-03T13:29:28.000Z",
    "updatedAt": "2024-08-03T15:23:39.000Z"
  }
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Update. No record found with ID: ${caseId}"
}
```

- 400 Bad Request

```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**Validation Error Messages**

| Property      | Validation Rule           | Error Message                                                                                             |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `cityId`      | Must be a number          | `City ID must be a numeric value.`                                                                        |
| `description` | Must be a string          | `Description must be a string value.`                                                                     |
| `regionId`    | Must be a number          | `Region ID must be a numeric value.`                                                                      |
| `status`      | Must be one of [statuses] | `Status must be one of the following values: ${statuses.join(', ')}.`<br>`Status must be a string value.` |

</details>

#### Delete Case

<details>

- **URL**: `api/v1/cases/:id`
- **Method**: `DELETE`
- **Description**: Delete a case by ID.
- **Parameters**: `caseId` (integer): ID of the case.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `client`

**Response:**

- 204 No Content

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${caseId}"
}
```

</details>

### Reviews

#### Create Review

<details>

- **URL:** `api/v1/reviews`
- **Method:** `POST`
- **Description:** Create a new review.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `client`

**Request Body:**

```json
{
  "clientId": 1,
  "lawyerId": 2,
  "rating": 5,
  "reviewText": "Excellent lawyer, highly recommended!"
}
```

**Response:**

- 201 Created

```json
{
  "status": "success",
  "message": "Successfully created new review",
  "data": {
    "reviewId": 2,
    "clientId": 2,
    "lawyerId": 5,
    "reviewText": "Excellent lawyer, highly recommended!",
    "rating": 5
  }
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Validation error."
}
```

**Validation Error Examples**:

| Property     | Validation Rule                  | Error Message                                                                                                             |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `clientId`   | Required, number                 | `Client ID is required.`<br>`Client ID must be a numeric value.`                                                          |
| `lawyerId`   | Required, number                 | `Lawyer ID is required.`<br>`Lawyer ID must be a numeric value.`                                                          |
| `rating`     | Required, number, min: 1, max: 5 | `Rating is required.`<br>`Rating must be a numeric value.`<br>`Rating must be at most 5.`<br>`Rating must be at least 1.` |
| `reviewText` | Required, string                 | `Review text is required.`<br>`Review text must be a string.`                                                             |

</details>

#### Get Review by Id

<details>

- **URL:** `api/v1/reviews/:id`
- **Method:** `GET`
- **Description:** Retrieve details of a review by Id.
- **Parameters:** `reviewId`(integer): Id of the review.

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Review retrieved successfully",
  "data": {
    "reviewId": 2,
    "clientId": 2,
    "lawyerId": 5,
    "reviewText": "Excellent lawyer, highly recommended!",
    "rating": 5
  }
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: ${reviewId}"
}
```

</details>

#### Get Many Reviews

<details>

- **URL:** `api/v1/reviews`
- **Method:** `GET`
- **Description:** Retrieve a list of reviews.

**Query Parameters:**

- `clientId` (optional): Filter by client ID.
- `endDate` (optional): Filter reviews by end date.
- `lawyerId` (optional): Filter by lawyer ID.
- `limit` (optional): Limit the number of reviews returned.
- `page` (optional): Specify the page number for pagination.
- `ratingMax` (optional): Maximum rating filter.
- `ratingMin` (optional): Minimum rating filter.
- `search` (optional): Search reviews by content.
- `sortBy` (optional): Sort reviews by specific fields. Possible values: `createdAt`, `rating`.
- `sortOrder` (optional): Order of sorting. Possible values: `desc`, `asc`.
- `startDate` (optional): Filter reviews by start date.

**Example Request:**

```plaintext
GET /api/v1/reviews?clientId=2&limit=10&page=1&sortBy=createdAt&sortOrder=desc

```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Reviews retrieved successfully.",
  "data": [
    {
      "reviewId": 1,
      "clientId": 2,
      "lawyerId": 3,
      "rating": 5,
      "reviewText": "Excellent lawyer, highly recommended!",
      "createdAt": "2024-08-03T13:29:28.000Z",
      "updatedAt": "2024-08-03T13:29:28.000Z"
    }
    // more review objects
  ]
}
```

- 400 Bad Request

```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**Validation Error Messages:**

| Property    | Validation Rule                    | Error Message                                                                                                            |
| ----------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `clientId`  | Must be a number                   | `Client ID must be a numeric value.`                                                                                     |
| `endDate`   | Must be a valid date               | `End date must be a valid date.`                                                                                         |
| `lawyerId`  | Must be a number                   | `Lawyer ID must be a numeric value.`                                                                                     |
| `limit`     | Must be a number                   | `Limit must be a numeric value.`                                                                                         |
| `page`      | Must be a number                   | `Page must be a numeric value.`                                                                                          |
| `ratingMax` | Must be a number, min: 1, max: 5   | `Maximum rating must be a numeric value.`<br>`Maximum rating must be at most 5.`<br>`Maximum rating must be at least 1.` |
| `ratingMin` | Must be a number, min: 1, max: 5   | `Minimum rating must be a numeric value.`<br>`Minimum rating must be at most 5.`<br>`Minimum rating must be at least 1.` |
| `search`    | Must be a string                   | `Search must be a string.`                                                                                               |
| `sortBy`    | Must be one of [createdAt, rating] | `Sort by must be one of the following values: createdAt, rating.`<br>`Sort by must be a string.`                         |
| `sortOrder` | Must be 'desc' or 'asc'            | `Sort order must be either "desc" or "asc".`<br>`Sort order must be a string.`                                           |
| `startDate` | Must be a valid date               | `Start date must be a valid date.`                                                                                       |

</details>

#### Update Review

<details>

- **URL**: `api/v1/reviws/:id`
- **Method**: `PATCH`
- **Description**: Update details of a review by ID.
- **Parameters**: `reviewId` (integer): ID of the review.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `client`

**Allowed columns:**

- `rating`
- `reviewText`

**Request Body**:

```json
{
  "rating": 4,
  "reviewText": "Very good lawyer, would recommend."
}
```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Review updated successfully.",
  "data": {
    "reviewId": 1,
    "clientId": 2,
    "lawyerId": 3,
    "rating": 4,
    "reviewText": "Very good lawyer, would recommend.",
    "createdAt": "2024-08-03T13:29:28.000Z",
    "updatedAt": "2024-08-03T15:23:39.000Z"
  }
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Update. No record found with ID: ${reviewId}"
}
```

- 400 Bad Request

```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**Validation Error Messages**

| Property     | Validation Rule                  | Error Message                                                                                    |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `rating`     | Must be a number, min: 1, max: 5 | `Rating must be a numeric value.`<br>`Rating must be at most 5.`<br>`Rating must be at least 1.` |
| `reviewText` | Must be a string                 | `Review text must be a string.`                                                                  |

</details>

#### Delete Review

<details>

- **URL**: `api/v1/reviews/:id`
- **Method**: `DELETE`
- **Description**: Delete a review by ID.
- **Parameters**: `reviewId` (integer): ID of the review.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `admin`
  - `client`

**Response:**

- 204 No Content

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${reviewId}"
}
```

</details>

### Messages

#### Create Message

<details>

- **URL:** `api/v1/message`
- **Method:** `POST`
- **Description:** Create a new message.
- **Protection**: `JWT`
- **Role Restrictions**:
  - `client`
  - `lawyer`

**Request Body:**

```json
{
  "message": "Hello, I need some legal advice.",
  "receiverId": 2,
  "senderId": 1
}
```

**Response:**

- 201 Created

```json
{
  "status": "success",
  "message": "Successfully created message",
  "data": {
    "messageId": 1,
    "senderId": 1,
    "receiverId": 2,
    "message": "Hello, I need some legal advice.",
    "createdAt": "2024-08-04T09:59:12.000Z",
    "updatedAt": "2024-08-04T09:59:12.000Z"
  }
}
```

- 400 Bad Request (Validation errors)

```json
{
  "status": "error",
  "message": "Validation error."
}
```

**Validation Error Examples**:

| Property     | Validation Rule  | Error Message                                                 |
| ------------ | ---------------- | ------------------------------------------------------------- |
| `message`    | Required, string | `Message is required.`<br>`Message must be a string.`         |
| `receiverId` | Required, number | `Receiver ID is required.`<br>`Receiver ID must be a number.` |
| `senderId`   | Required, number | `Sender ID is required.`<br>`Sender ID must be a number.`     |

</details>

#### Get Message by Id

<details>

- **URL:** `api/v1/messages/:id`
- **Method:** `GET`
- **Description:** Retrieve details of a message by Id.
- **Parameters:** `messageId`(integer): Id of the message.
- **Role Restrictions**:
  - `client`
  - `lawyer`
  - `admin`

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Message retrieved successfully",
  "data": {
    "messageId": 1,
    "senderId": 1,
    "receiverId": 2,
    "message": "Hello, I need some legal advice.",
    "createdAt": "2024-08-04T09:59:12.000Z",
    "updatedAt": "2024-08-04T09:59:12.000Z"
  }
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Get. No record found with ID: ${messageId}"
}
```

</details>

#### Get Many Messages

<details>

- **URL:** `api/v1/messages`
- **Method:** `GET`
- **Description:** Retrieve a list of messages.
- **Role Restrictions**:
  - `client`
  - `lawyer`
  - `admin`

**Query Parameters:**

- `endDate` (optional): Filter messages by end date.
- `limit` (optional): Limit the number of messages returned.
- `page` (optional): Specify the page number for pagination.
- `receiverId` (optional): Filter by receiver ID.
- `search` (optional): Search messages by content.
- `senderId` (optional): Filter by sender ID.
- `sortBy` (optional): Sort messages by specific fields. Possible values: `createdAt`, `updatedAt`.
- `sortOrder` (optional): Order of sorting. Possible values: `desc`, `asc`.
- `startDate` (optional): Filter messages by start date.

**Example Request:**

```plaintext
GET /api/v1/messages?receiverId=2&limit=10&page=1&sortBy=createdAt&sortOrder=desc

```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Messages retrieved successfully",
  "data": [
    {
      "messageId": 1,
      "senderId": 1,
      "receiverId": 2,
      "message": "Hello, I need some legal advice.",
      "createdAt": "2024-08-04T09:59:12.000Z",
      "updatedAt": "2024-08-04T09:59:12.000Z"
    }
    // more messages objects
  ]
}
```

- 400 Bad Request

```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**Validation Error Messages:**

| Property     | Validation Rule                       | Error Message                                                                                       |
| ------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `endDate`    | Must be a valid date                  | `End date must be a valid date.`                                                                    |
| `limit`      | Must be a number                      | `Limit must be a number.`                                                                           |
| `page`       | Must be a number                      | `Page must be a number.`                                                                            |
| `receiverId` | Must be a number                      | `Receiver ID must be a number.`                                                                     |
| `search`     | Must be a string                      | `Search must be a string.`                                                                          |
| `senderId`   | Must be a number                      | `Sender ID must be a number.`                                                                       |
| `sortBy`     | Must be one of [createdAt, updatedAt] | `Sort by must be one of the following values: createdAt, updatedAt.`<br>`Sort by must be a string.` |
| `sortOrder`  | Must be 'desc' or 'asc'               | `Sort order must be either "desc" or "asc".`<br>`Sort order must be a string.`                      |
| `startDate`  | Must be a valid date                  | `Start date must be a valid date.`                                                                  |

</details>

#### Update Message

<details>

- **URL**: `api/v1/messages/:id`
- **Method**: `PATCH`
- **Description**: Update details of a message by ID.
- **Parameters**: `messageId` (integer): ID of the message.
- **Role Restrictions**:
  - `client`
  - `lawyer`

**Allowed columns:**

- `message`

**Request Body**:

```json
{
  "message": "Updated message content."
}
```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Message updated successfully.",
  "data": {
    "messageId": 1,
    "message": "Updated message content.",
    "receiverId": 2,
    "senderId": 1,
    "createdAt": "2024-08-03T13:29:28.000Z",
    "updatedAt": "2024-08-03T15:23:39.000Z"
  }
}
```

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Update. No record found with ID: ${messageId}"
}
```

- 400 Bad Request

```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**Validation Error Messages**

| Property  | Validation Rule  | Error Message                                         |
| --------- | ---------------- | ----------------------------------------------------- |
| `message` | Required, string | `Message is required.`<br>`Message must be a string.` |

</details>

#### Delete Message

<details>

- **URL**: `api/v1/messages/:id`
- **Method**: `DELETE`
- **Description**: Delete a message by ID.
- **Parameters**: `messageId` (integer): ID of the message.
- **Role Restrictions**:
  - `admin`
  - `client`
  - `lawyer`

**Response:**

- 204 No Content

- 404 Not Found

```json
{
  "status": "error",
  "message": "Failed to Remove. No record found with ID: ${messageId}"
}
```

</details>

### Cities

#### Get Cities by Region

<details>

- **URL**: `api/v1/cities`
- **Method**: `GET`
- **Description**: Retrieve a list of cities by region ID.
- **Query Parameters:** - `regionId` (integer, required): id of the region.

**Example Request:**

```plaintext
GET /api/v1/cities?regionId=1
```

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Cities retrieved successfully.",
  "data": [
    {
      "cityId": 1,
      "name": "City Name",
      "regionId": 1
    }
    // more city objects
  ]
}
```

- 400 Bad Request

```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**Validation Error Messages**

| Property   | Validation Rule   | Error Message                                                                                |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------- |
| `regionId` | Required, integer | `Region id is required.`<br>`Region id must be a number.`<br>`Region id must be an integer.` |

</details>

### Regions

#### Get All Regions

<details>

- **URL**: `api/v1/regions`
- **Method**: `GET`
- **Description**: Retrieve a list of all regions.

**Response:**

- 200 OK

```json
{
  "status": "success",
  "message": "Regions retrieved successfully.",
  "data": [
    {
      "regionId": 2,
      "name": "Region Name"
    }
    // more region objects
  ]
}
```

</details>
