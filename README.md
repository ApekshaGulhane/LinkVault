# LinkVault -- Secure Temporary Sharing Application

## Project Overview

LinkVault is a secure web-based application that allows users to share
text or files through temporary links. These links automatically expire
after a selected time and can also be protected with a password or
limited by maximum number of views.

The main goal of this project was to build a simple but secure sharing
platform that gives users control over how long their data remains
accessible.

------------------------------------------------------------------------

## Features Implemented

-   User Registration and Login\
-   JWT-based authentication and authorization\
-   Upload either text or a file\
-   Custom expiry time for links\
-   Optional password protection\
-   Optional maximum view limit\
-   Delete link functionality (only by authenticated user)\
-   Automatic deletion of expired links using a background job

------------------------------------------------------------------------

## Tech Stack Used

### Frontend

-   React (with Vite)
-   React Router
-   Axios
-   Tailwind CSS

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT (JSON Web Token)
-   Bcrypt (for password hashing)
-   Multer (for file upload handling)
-   Node-Cron (for background cleanup job)

------------------------------------------------------------------------

## Setup Instructions

### 1. Clone the Repository

git clone `<your-repository-link>`{=html} cd linkvault

------------------------------------------------------------------------

### 2. Backend Setup

cd backend npm install

Create a .env file inside the backend folder and add:

PORT=5001\
MONGO_URI=your_mongodb_connection_string\
JWT_SECRET=your_secret_key

Start the backend server:

node server.js

The backend will run on: http://localhost:5001

------------------------------------------------------------------------

### 3. Frontend Setup

cd frontend npm install npm run dev

Open the application at: http://localhost:5173

------------------------------------------------------------------------

## API Overview

### Authentication

POST /auth/register\
Registers a new user with email and password.

POST /auth/login\
Authenticates the user and returns a JWT token.

------------------------------------------------------------------------

### Link Management

POST /upload\
Uploads text or file and generates a temporary link.\
Requires authentication.

GET /:id\
Fetches shared content using unique link ID.

DELETE /delete/:id\
Deletes a link. Only accessible to authenticated users.

------------------------------------------------------------------------

## Database Schema

### User Model

-   email (String)
-   password (Hashed String)

### Link Model

-   uniqueId (String)
-   text (Optional String)
-   fileUrl (Optional String)
-   expiresAt (Date)
-   createdAt (Date)
-   password (Optional Hashed String)
-   viewCount (Number)
-   maxViews (Optional Number)

------------------------------------------------------------------------

## Design Decisions

-   JWT authentication is used to protect sensitive routes.
-   Passwords are hashed using bcrypt before storing in database.
-   Each link has an expiry timestamp to ensure temporary access.
-   Optional password protection adds an extra layer of security.
-   Max view count prevents unlimited sharing.
-   A background cron job runs periodically to remove expired data.
-   Multer is used to safely handle file uploads.

------------------------------------------------------------------------

## Assumptions

-   Users must log in before uploading or deleting content.
-   Files are stored locally on the server.
-   Once expired, links cannot be recovered.
-   No email verification process is implemented.

------------------------------------------------------------------------

## Limitations

-   No cloud storage integration.
-   No admin dashboard.
-   No refresh token system.
-   Basic file validation only.
-   UI can be further improved for production use.

------------------------------------------------------------------------

## High-Level Data Flow

1.  User logs in or registers.
2.  Frontend sends request to backend.
3.  Backend verifies JWT using middleware.
4.  Data is stored in MongoDB.
5.  Unique link is generated and returned.
6.  When link is accessed:
    -   Expiry and view count are validated.
    -   Content is returned if valid.
7.  Cron job deletes expired entries automatically.

------------------------------------------------------------------------

## Important Note

The node_modules folder is excluded using .gitignore.
