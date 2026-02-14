LinkVault is a full-stack web application that allows users to securely share text or files via unique links with customizable expiration times.

---

##  Features

- Upload **text** or **file** (only one at a time)
- Generate unique shareable link
- Custom expiry time:
  - 10 minutes
  - 1 hour
  - 1 day
  - Custom minutes
- Automatic expiry validation
- Download file support
- Copy-to-clipboard feature
- Clean modern UI (Tailwind CSS)

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (file upload)
- UUID (unique link generation)

---

## Project Structure

```
linkvault/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```


---

## How to Run the Project

### 1 Backend Setup

Go to backend folder:

cd backend
npm install


Create `.env` file:

PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/linkvault


Start backend:

npm run dev


Server runs on:
http://localhost:5001


---

### 2 Frontend Setup

Go to frontend folder:

cd frontend
npm install
npm run dev


Frontend runs on:
http://localhost:5173


---

## How It Works

1. User uploads text or file.
2. Backend generates unique UUID.
3. Expiry time is stored in MongoDB.
4. Frontend generates link using ID.
5. When link is opened:
   - If valid → content displayed.
   - If expired → error shown.
   - If file → download option available.

---

##  Expiry Logic

- Expiry time is calculated on upload.
- On access, backend checks:
if (new Date() > expiresAt)

- If expired → 410 status returned.

---

##  Validation Rules

- Only text OR file allowed.
- Both cannot be uploaded together.
- Custom expiry must be greater than 0.
- Expired links cannot be accessed.

---

##  UI Highlights

- Dark modern theme
- Centered card layout
- Responsive design
- Copy link button
- File download button

---

##  Future Improvements

- Auto-delete expired links
- Drag & drop file upload
- Authentication system
- Cloud file storage (AWS S3)
- Deployment to cloud platform

---