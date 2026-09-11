# 🚀 Terry's Personal Portfolio & Project Hub

A full-stack personal portfolio website built to showcase and manage my development projects.

🔗 **Live:** [terryyoon.vercel.app](https://terryyoon.vercel.app/)
> 💡 **Note:** The initial load may take a little longer due to free-tier hosting.
---

## 🛠 Tech Stack

### Frontend

- **React**
- **JavaScript**

### Backend

- **FastAPI**
- **Python**
- **JWT Authentication**

### Database & Storage

- **PostgreSQL**
- **Firebase Storage**

### Deployment

- **Vercel** — Frontend
- **Render** — Backend

---

## ✨ Key Features

### 📁 Portfolio Management

- Create, update, and delete project information through the admin interface
- Manage portfolio content without modifying frontend source code

### 🔐 Admin Authentication

- JWT-based authentication for administrator access
- Public visitors can browse portfolio content without logging in

### 💬 Guestbook

- Visitors can leave messages without creating an account

### 🖼️ Image Management

- Upload project images to Firebase Storage
- Store image URLs in PostgreSQL

### 📊 Visit Tracking

- Tracks website visits through the backend
- Prevents duplicate visits from the same IP address on the same day

---

## 🏗️ Architecture

The application uses a separated frontend and backend structure.

```text
React
  ↓
FastAPI
  ↓
PostgreSQL
```

Firebase Storage is used separately for image files.

The React frontend communicates with the FastAPI backend, while the backend handles authentication, application logic, and database operations.

🗄️ Database Design
PostgreSQL is used to manage the structured data for the portfolio.

The database contains related data such as:

Projects

Skills

Guestbook messages

Image files are stored separately in Firebase Storage, while their URLs are stored in PostgreSQL.

The database structure was designed based on the current requirements and can be expanded as the portfolio grows.

💡 Why I Built This
I wanted more than a static portfolio website.

I wanted to be able to add, update, and delete project information through the website instead of modifying the frontend source code whenever my portfolio changed.

This project also gave me an opportunity to expand my experience from mobile development into web development and practice building a full-stack application with React, FastAPI, and PostgreSQL.

📚 What I Learned
Building reusable components with React

Building APIs with FastAPI

Working with PostgreSQL

Implementing JWT authentication

Connecting the React frontend with the FastAPI backend

Managing project data with PostgreSQL and image files with Firebase Storage

Deploying the frontend and backend separately
