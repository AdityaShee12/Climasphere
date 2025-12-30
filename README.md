# Climasphere 🌍

Climasphere is a MERN Stack web application focused on environmental data, analysis, and education. The platform allows users to view weather and air pollution data based on their location, download datasets, access analytical insights, and learn from environment-related knowledge. Some community and AI features are planned for future releases. The main goal is environmental education, not just showing temperature or AQI numbers.

---

## Project Features

- Automatic location detection
- Real-time weather and pollution data
- Download weather and pollution datasets
- Data analyst portal for uploading analytical insights
- View analytical insights uploaded by analysts
- Educational focus on environmental data
- Responsive design for mobile, tablet, and desktop
- Community chat and posts (in development)
- AI-assisted insights explanation (planned)

---

## Feature Status

| Feature | Status |
|---------|--------|
| Location-based weather & pollution data | Completed |
| Data download for users | Completed |
| Data analyst portal | Completed |
| Insights publishing & viewing | Completed |
| Community chat & posts | In Development |
| AI integration for insights | Planned |
| Responsive for mobile & tablet | Completed |

---

## Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js
- Express.js
- RESTful APIs
- JWT Authentication

### Database
- MongoDB

### Real-Time & Media
- WebSocket (real-time data)
- Cloudinary (media storage)

### Authentication & Security
- JWT-based authentication
- AES-based encryption (planned for insights)
- OAuth (planned)

---

## System Architecture

Client (React + Redux) communicates via REST APIs and WebSocket with Server (Node.js + Express) which interacts with MongoDB and integrates Cloudinary, APIs, and planned AI modules.

---

## Roadmap

### Phase 1 Completed
- Automatic location detection
- Real-time weather & pollution display
- Data download for users
- Data analyst portal
- Educational insights display
- Responsive design

### Phase 2 In Progress
- Community chat & posts
- Social interaction features

### Phase 3 Planned
- AI integration for explaining analysis
- Enhanced educational support features

---

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