# 🌍 ClimaSphere

**ClimaSphere** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that provides real-time weather and air pollution data, empowers data analysts to derive and share environmental insights, and creates a collaborative space for environmentologists and researchers to publish content and exchange knowledge.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Authentication Flow](#authentication-flow)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## 🧭 Overview

ClimaSphere bridges the gap between raw environmental data and meaningful insight. Using the **OpenWeather API**, the platform fetches live weather and air pollution data for users to explore. Beyond simple data viewing, ClimaSphere introduces role-based functionality — allowing **data analysts** to download data for offline analysis and upload their findings as insights, while **environmentologists and researchers** can publish blogs/posts and interact with other users through an in-app chat system for knowledge sharing.

---

## ✨ Features

### 🔐 Authentication
- Secure Sign Up / Sign In system
- OTP (One-Time Password) verification via **Nodemailer** during registration
- **JWT (JSON Web Token)**-based authentication for protected routes and session management

### 🌦️ Weather & Pollution Data
- Real-time weather data fetched using the **OpenWeather API**
- Real-time air pollution/AQI data fetched using the **OpenWeather Pollution API**
- Clean, user-friendly dashboard to visualize current conditions

### 📊 Data Analysis Module
- Data analysts can **download fetched weather/pollution data in CSV format**
- Analysts can perform their own analysis offline and **upload their insights/analysis results** back to the platform
- Other users can browse and view these published insights

### 📝 Environmental Blogging
- Environmentologists and researchers can write and publish **environment-related posts/blogs**
- Encourages awareness and sharing of research findings with the community

### 💬 Real-Time Chat
- In-app chatting system enabling users to **connect and share knowledge** directly with one another

---

## 🛠️ Tech Stack

| Layer            | Technology                          |
|-------------------|--------------------------------------|
| Frontend          | React.js, Tailwind CSS               |
| Backend           | Node.js, Express.js                  |
| Database          | MongoDB                              |
| Authentication    | JWT, OTP (via Nodemailer)            |
| Email Service     | Nodemailer                           |
| External API      | OpenWeather API (Weather & Pollution)|

---

## 👥 User Roles

| Role                          | Capabilities                                                                 |
|-------------------------------|-------------------------------------------------------------------------------|
| **General User**              | View weather & pollution data, read insights, read blogs/posts, use chat     |
| **Data Analyst**              | Download data as CSV, upload analysis results/insights                      |
| **Environmentologist/Researcher** | Write & publish environment-related blogs/posts, use chat                |

---

## 🏗️ System Architecture

```
Client (React.js + Tailwind CSS)
        │
        ▼
Express.js REST API (Node.js)
        │
   ┌────┼─────────────┐
   ▼    ▼              ▼
MongoDB  OpenWeather API   Nodemailer (OTP Emails)
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local instance or MongoDB Atlas)
- An OpenWeather API key
- An email account/service configured for Nodemailer (e.g., Gmail App Password)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/climasphere.git
   cd climasphere
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the `server` directory (see [Environment Variables](#environment-variables) below).

5. **Run the backend server**
   ```bash
   cd server
   npm run dev
   ```

6. **Run the frontend**
   ```bash
   cd client
   npm start
   ```

7. Open `http://localhost:3000` in your browser.

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

---

## 📁 Folder Structure

```
ClimaSphere/
├── ClimaSphere-Frontend/                  # React.js frontend
│   ├── src/
|   |   ├── api/
|   |   |    ├── api.js
|   |   |    ├── Backend_API.js
|   |   ├── app/
|   |   |    ├── main.js
|   |   |    ├── store.js
|   |   ├── Background/
|   |   |    ├── Background.jsx
|   |   ├── components/
|   |   |    ├── chat/
|   |   |    |    ├─ ChatSidebar.jsx
|   |   |    ├── AirQualityCard.jsx
|   |   |    ├── ButtomNavbar.jsx
|   |   |    ├── graph.jsx
|   |   |    ├── Post.jsx
|   |   |    ├── Videopage.jsx
│   │   ├── dataAnalystPortal/
|   |   |    ├── DataAnalystPortal.jsx
│   │   ├── Download/
|   |   |    ├── Download.jsx
|   |   ├── features/
|   |   |    ├── groupMessageSlice.jsx
|   |   |    ├── layoutSlice.jsx
|   |   |    ├── userSlice.jsc
│   │   ├── Feed/
│   │   │   ├── MainFeed.jsx
│   │   │   └── UpperFeed.jsx
│   │   ├── Layout/
│   │   │   ├── ChatLayout.jsx
│   │   │   ├── HomeLayout.jsx
│   │   │   └── PostLayout.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── home/
│   │   │   └── post/
│   │   ├── context/
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/                # API call functions
│   │   ├── sockets/
│   │   │   └── socket.js
│   │   ├── VideoFeed/
│   │   ├── Backend_API.js
│   │   ├── index.css
│   │   └── App.js
│   └── tailwind.config.js
│
├── ClimaSphere-Backend/                  # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/           # JWT auth middleware
│   ├── utils/                 # Nodemailer, OTP helpers
│   └── server.js
│
└── README.md
```

---

## 🔐 Authentication Flow

1. User signs up with email and basic details.
2. An OTP is generated and sent to the user's email using **Nodemailer**.
3. User verifies the OTP to activate their account.
4. On successful Sign In, the server issues a **JWT token**.
5. The token is stored client-side and sent with each request to access protected routes.

---

## 📸 Screenshots

> *(Add screenshots of the dashboard, weather view, CSV download, insights page, blog page, and chat interface here.)*

---

## 🚀 Future Improvements

- Push notifications for severe weather alerts
- Interactive data visualization (charts/graphs) for pollution trends
- Advanced search and filtering for blogs and insights
- Mobile-responsive PWA support
- Admin panel for content moderation

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository, create a new branch, and submit a pull request.

---

## 📄 License

This project is developed for academic/college purposes. You may use, modify, and distribute it with proper attribution.

---

**Developed as a college project using the MERN Stack.**

## Installation and Setup

### Step 1 Clone the Repository
git clone https://github.com/AdityaShee12/Climasphere.git  
cd Climasphere

### Step 2 Backend Setup
cd Climasphere-Backend  
npm install

Create a `.env` file in the backend folder and add:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
WEATHER_API_KEY=your_weather_api_key  
AIR_QUALITY_API_KEY=your_air_quality_api_key  
JWT_SECRET=your_jwt_secret

Run backend server:  
npm run dev

---

### Step 3 Frontend Setup
cd ../Climasphere-Frontend  
npm install  
npm run dev

---

## Usage

- Open the application to automatically detect your location
- View real-time weather and pollution data
- Sign up or log in to download datasets and view analytical insights
- Analysts can upload processed insights
- Students and researchers can use data for educational purposes
- Future AI features will help explain complex insights
- Fully responsive across mobile, tablet, and desktop

---

## Author

Aditya Shee  
GitHub: https://github.com/AdityaShee12

---

## License

This project is licensed under the MIT License.
