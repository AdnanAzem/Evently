
# Travel Planner Application

The **Travel Planner Application** is a full-stack web application that allows users to plan their trips by searching for destinations, viewing weather forecasts, and saving travel plans. Users can log in, save their favorite destinations, and view their saved plans on a personalized dashboard.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Authentication Flow](#authentication-flow)
6. [Contributing](#contributing)


---

## Features

- **User Authentication**:
  - Register and log in using JWT tokens.
  - Secure token-based authentication for protected routes.

- **Destination Search**:
  - Search for cities and view weather data (powered by OpenWeatherMap API).
  - View activity suggestions (powered by Foursquare API).

- **Save Travel Plans**:
  - Save destinations with start/end dates, weather, and activities.
  - View saved plans on a personalized dashboard.

- **Responsive Design**:
  - A clean and user-friendly interface built with HTML, CSS, and EJS.

---

## Technologies Used

### Backend
- **Node.js**: Runtime environment for server-side logic.
- **Express.js**: Web framework for building APIs and handling routes.
- **PostgreSQL**: Relational database for storing user data and travel plans.
- **JWT**: JSON Web Tokens for secure authentication.


### Frontend
- **HTML/CSS**: Structuring and styling the user interface.
- **EJS**: Templating engine for rendering dynamic pages.
- **JavaScript**: Handling client-side logic and API requests.

### APIs
- **OpenWeatherMap API**: Fetches weather data for searched destinations.
- **Foursquare API**: Provides activity suggestions for searched destinations.

---

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher) installed on your machine.
- **PostgreSQL** database installed and running.
- API keys for **OpenWeatherMap** and **Foursquare**.

### Steps to Run the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AdnanAzem/Evently
   cd Evently

2. **Install Dependencies**
    ```bash
    npm install

3. **Set Up Environment Variables**
    Create a ```.env``` file in the root directory and add the following variables:
    ```bash
    PORT=3000
    DATABASE_URL=postgres://username:password@localhost:5432/travel_planner
    JWT_SECRET=your_jwt_secret_key
    OPENWEATHER_API_KEY=your_openweathermap_api_key
    FOURSQUARE_API_KEY=your_foursquare_api_key

4. **Set Up the Database**
    - Create a PostgreSQL database named ```travel_planner```.
    - Run the migrations to create the required tables:
    ```bash
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );

    CREATE TABLE travel_plans (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        destination VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        weather_data JSONB NOT NULL
    );

    CREATE TABLE activities (
        id SERIAL PRIMARY KEY,
        plan_id INT REFERENCES travel_plans(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255)
    );

5. **Start the Server**
    ```bash
    node app.js

6. **Access the Application**
    Open your browser and navigate to:
    ```bash
    http://localhost:3000/

---

### API Endpoints
#### Authentication 

- POST ```/api/auth/register```: Register a new user.
    - Body: ```{ "username": "testuser", "email": "test@example.com", "password": "password123" }```
         
- POST ```/api/auth/login``` : Log in an existing user.
    - Body: ```{ "email": "test@example.com", "password": "password123" }```
         
     

#### Travel Plans 

- POST ```/api/travel/search``` : Search for destinations and fetch weather/activity data.
    - Body: ```{ "city": "New York" }```
         
- POST ```/api/travel/save-plan``` : Save a travel plan.
    - Headers: ```{ "Authorization": "Bearer <token>" }```
    - Body: ```{ "destination": "New York", "startDate": "2023-12-01", "endDate": "2023-12-05", ... }```
         
- GET ```/api/travel/plans``` : Fetch all travel plans for the authenticated user.
    - Headers: ```{ "Authorization": "Bearer <token>" }```

---
### Authentication Flow
1. Register : Users register by providing a username, email, and password.
2. Login : Users log in with their email and password. Upon successful login, a JWT token is generated and stored in ```localStorage```.
3. Protected Routes : The token is included in the ```Authorization``` header for all protected routes (e.g., ```/dashboard```).
4. Logout : Clear the token from ```localStorage``` to log out.
     
         
     
