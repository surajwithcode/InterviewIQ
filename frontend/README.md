# 🚀 InterviewIQ

## Overview
This is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Google's Gemini AI. It allows users to create personalized interview preparation sessions based on their target job role and experience level. The AI then generates highly relevant, technical interview questions and answers, which are saved to the user's dashboard for review.

---

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React Router, Framer Motion, Axios.
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT) for authentication.
* **Database:** MongoDB Atlas with Mongoose ORM.
* **AI Integration:** Google Gemini AI (`@google/genai`).

---

## 🔗 How It Works: The User Journey & Connections
Here is the step-by-step flow of how the pages connect and communicate with the backend.

**1. The Starting Point (Landing Page)**
* **Page:** `LandingPage.jsx` (`/`)
* **Action:** The user arrives at the site and clicks "Get Started". 
* **Connection:** React Router navigates the user to the Login page.

**2. Authentication (Sign Up & Login)**
* **Pages:** `SignUp.jsx` (`/signup`) and `Login.jsx` (`/login`)
* **Action:** The user enters their credentials.
* **Backend Connection:** The frontend sends a POST request to `/api/auth/signup` or `/api/auth/login`. 
* **Database Action:** The backend securely hashes the password using `bcryptjs` and checks/saves the user in MongoDB.
* **The Handshake:** If successful, the backend creates a secret `JWT Token` and sends it to the frontend. The frontend saves this token in the browser's `localStorage` and redirects the user to the Dashboard.

**3. The Control Center (Dashboard)**
* **Page:** `Dashboard.jsx` (`/dashboard`)
* **Action:** The page loads and immediately asks the backend for all sessions belonging to this specific user.
* **Backend Connection:** Sends a GET request to `/api/sessions/my-sessions`. The backend uses the JWT token to verify the user's identity before returning their data.
* **Creating a Session:** The user enters a Role (e.g., "React Dev") and Experience (e.g., "2 years") and clicks "+ Create". This sends a POST request to the backend to save a new blank session to MongoDB.

**4. The Magic Happens (Interview Prep Page)**
* **Page:** `InterviewPrep.jsx` (`/interview/:id`)
* **Connection:** Clicking a session card on the Dashboard uses React Router to open this page, passing the unique Session ID in the URL.
* **Action:** The user clicks "Generate Questions".
* **Backend AI Connection:** The frontend sends a POST request to `/api/ai/generate-questions`. 
* **The AI Brain:** The backend takes the user's role and experience and constructs a detailed prompt. It sends this prompt to the **Google Gemini API**. 
* **Saving the Data:** Gemini replies with a JSON array of technical questions and answers. The backend saves these newly generated questions into MongoDB and links them to the current session.
* **Display:** The frontend receives the questions and renders them beautifully using `react-markdown` and Framer Motion animations.

**5. Logging Out**
* **Action:** The user clicks "Logout" on the Dashboard.
* **Connection:** The frontend deletes the `JWT Token` from `localStorage` (acting as the key being thrown away) and redirects the user back to the Login page.

---

## 📁 Project Structure Breakdown

### Frontend (`/frontend/src`)
* **`/components`**: Reusable UI parts like buttons, empty states, and the `QAItem` card that handles the dropdown animation for answers.
* **`/pages`**: The main views (Landing, Login, Signup, Dashboard, InterviewPrep).
* **`/utils`**: Contains `apiPaths.js` (keeps API URLs organized) and `axiosInstance.js` (automatically attaches the JWT security token to every request sent to the backend).

### Backend (`/backend`)
* **`/config`**: Connects the server to the MongoDB Atlas database.
* **`/models`**: Defines the shape of the data using Mongoose (User, Session, Question).
* **`/routes`**: The traffic cops. They look at incoming requests and send them to the right controller (`auth-route`, `session-route`, `ai-route`).
* **`/controller`**: The actual brain logic. This is where passwords are checked, database entries are created, and the Gemini AI is contacted.
* **`/middlewares`**: Contains `auth-middleware.js` which acts as a bouncer, checking if the user has a valid JWT token before letting them access protected routes.
* **`index.js`**: The main entry point that starts the Express server on port 9000.

---

## ⚙️ Local Setup Instructions

**1. Clone the repository and install dependencies:**
* Navigate to the `/backend` folder and run `npm install`.
* Navigate to the `/frontend` folder and run `npm install`.

**2. Configure Environment Variables:**
Create a `.env` file inside the `/backend` directory and add the following keys:
* `MONGODB_URI` = Your MongoDB Atlas connection string.
* `JWT_SECRET` = A random, secure string for generating login tokens.
* `GEMINI_API_KEY` = Your Google AI Studio API key.

**3. Run the Application:**
* Start the backend: Open a terminal in `/backend` and run `npx nodemon index.js` (runs on port 9000).
* Start the frontend: Open a second terminal in `/frontend` and run `npm run dev` (runs on port 5173).

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🚀 InterviewIQ
Overview
Yeh ek full-stack web application hai jo MERN stack (MongoDB, Express, React, Node.js) ka use karke banayi gayi hai aur Google ke Gemini AI se powered hai. Yeh users ko unke target job role aur experience level ke basis par personalized interview preparation sessions create karne allow karta hai. Iske baad, AI highly relevant, technical interview questions aur answers generate karta hai, jo user ke dashboard mein review ke liye save ho jaate hain.

🛠️ Tech Stack
Frontend: React.js (Vite), Tailwind CSS, React Router, Framer Motion, Axios.

Backend: Node.js, Express.js, authentication ke liye JSON Web Tokens (JWT).

Database: Mongoose ORM ke saath MongoDB Atlas.

AI Integration: Google Gemini AI (@google/genai).

🔗 Yeh Kaise Kaam Karta Hai: User Journey & Connections
Yahan ek step-by-step flow hai ki pages kaise connect hote hain aur backend ke saath communicate karte hain.

1. The Starting Point (Landing Page)

Page: LandingPage.jsx (/)

Action: User site par aata hai aur "Get Started" par click karta hai.

Connection: React Router user ko Login page par navigate karta hai.

2. Authentication (Sign Up & Login)

Pages: SignUp.jsx (/signup) aur Login.jsx (/login)

Action: User apne credentials enter karta hai.

Backend Connection: Frontend /api/auth/signup ya /api/auth/login par POST request bhejta hai.

Database Action: Backend bcryptjs ka use karke password ko securely hash karta hai aur user ko MongoDB mein check/save karta hai.

The Handshake: Agar successful hota hai, toh backend ek secret JWT Token create karta hai aur isse frontend ko bhejta hai. Frontend iss token ko browser ke localStorage mein save karta hai aur user ko Dashboard par redirect kar deta hai.

3. The Control Center (Dashboard)

Page: Dashboard.jsx (/dashboard)

Action: Page load hota hai aur turant backend se iss specific user se jude sabhi sessions maangta hai.

Backend Connection: /api/sessions/my-sessions par GET request bhejta hai. Backend user ki identity verify karne ke liye JWT token ka use karta hai aur uske data return karne se pehle authentication check karta hai.

Creating a Session: User Role (e.g., "React Dev") aur Experience (e.g., "2 years") enter karta hai aur "+ Create" par click karta hai. Yeh MongoDB mein naya blank session save karne ke liye backend ko POST request bhejta hai.

4. The Magic Happens (Interview Prep Page)

Page: InterviewPrep.jsx (/interview/:id)

Connection: Dashboard par session card click karne par React Router URL mein unique Session ID pass karke is page ko kholta hai.

Action: User "Generate Questions" par click karta hai.

Backend AI Connection: Frontend /api/ai/generate-questions par POST request bhejta hai.

The AI Brain: Backend user ke role aur experience ko leta hai aur ek detailed prompt banata hai. Yeh iss prompt ko Google Gemini API ko bhejta hai.

Saving the Data: Gemini technical questions aur answers ke JSON array ke saath reply karta hai. Backend in naye generated questions ko MongoDB mein save karta hai aur unhe current session se link kar deta hai.

Display: Frontend questions receive karta hai aur unhe react-markdown aur Framer Motion animations ka use karke achhe se display karta hai.

5. Logging Out

Action: User Dashboard par "Logout" par click karta hai.

Connection: Frontend localStorage se JWT Token delete kar deta hai (jaise chaabi ko phenk diya gaya ho) aur user ko wapas Login page par redirect kar deta hai.

📁 Project Structure Breakdown
Frontend (/frontend/src)

/components: Reusable UI parts jaise buttons, empty states, aur QAItem card jo answers ke liye dropdown animation handle karta hai.

/pages: Main views (Landing, Login, Signup, Dashboard, InterviewPrep).

/utils: Isme apiPaths.js (API URLs ko organized rakhta hai) aur axiosInstance.js (har request ke saath backend par JWT security token automatically attach karta hai) shaamil hain.

Backend (/backend)

/config: Server ko MongoDB Atlas database se connect karta hai.

/models: Mongoose ka use karke data shape define karta hai (User, Session, Question).

/routes: Traffic cops ki tarah kaam karte hain. Yeh aane wali requests dekhte hain aur unhe sahi controller (auth-route, session-route, ai-route) par bhej dete hain.

/controller: Asal brain logic yahan hai. Yahan passwords check kiye jaate hain, database entries banayi jaati hain, aur Gemini AI ko contact kiya jata hai.

/middlewares: auth-middleware.js shaamil hai jo ek bouncer ki tarah kaam karta hai, yeh check karta hai ki user ke paas protected routes ko access karne se pehle valid JWT token hai ya nahi.

index.js: Main entry point jo port 9000 par Express server start karta hai.

⚙️ Local Setup Instructions
1. Repository ko clone karein aur dependencies install karein:

/backend folder mein navigate karein aur npm install run karein.

/frontend folder mein navigate karein aur npm install run karein.

2. Environment Variables configure karein:
/backend directory ke andar ek .env file create karein aur yeh keys add karein:

MONGODB_URI = Aapka MongoDB Atlas connection string.

JWT_SECRET = Login tokens generate karne ke liye ek random, secure string.

GEMINI_API_KEY = Aapka Google AI Studio API key.

3. Application ko run karein:

Backend start karein: /backend mein terminal open karein aur (npx nodemon index.js) run karein (port 9000 par run hota hai).

Frontend start karein: /frontend mein dusra terminal open karein aur (npm run dev) run karein (port 5173 par run hota hai).