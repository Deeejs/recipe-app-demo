# React Node Recipe Application

## Overview

The React Node Recipe Application is a modern, full-stack web application for browsing, creating, and sharing recipes. Built with the MERN stack—MongoDB, Express.js, React, and Node.js—this project leverages React for the frontend and Node.js for the backend, with PostgreSQL as the database. It features a beautiful and responsive UI using Material UI (MUI), designed to provide an exceptional user experience.

## Getting Started

### Prerequisites

Before setting up the project, please ensure you have the following installed on your system:

- Node.js (preferably the latest LTS version)
- npm (usually comes with Node.js)
- PostgreSQL

### Installation

1. **Clone the Repository**

   Start by cloning the repository to your local machine:

   ```bash
   git clone <repository-url>
   cd path-to-cloned-repo
   ```

2. **Set Up the Backend**

   Navigate to the backend directory:

   ```bash
   cd backend
   ```

   Install dependencies:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Use the `.env.example` file in the backend directory. Fill it with your PostgreSQL credentials and the API base URL as follows:

   ```env
   DB_USER=postgres
   DB_PASSWORD=<your-database-password>
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=recipes_database
   ```

   Replace `<your-database-password>` with your actual PostgreSQL database password.

   ```env

   ```

4. **Set Up the Frontend**

   Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

   Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

1. **Start the Backend Server**

   In the backend directory:

   ```bash
   npm start
   ```

   This will start the Node.js server, typically on port 4000.

2. **Launch the Frontend Application**

   Open a new terminal window, navigate to the frontend directory, and run:

   ```bash
   npm start
   ```

   The React app should now open in your default web browser, usually accessing `http://localhost:3000`.

## Usage

With both the frontend and backend running, you can browse to `http://localhost:3000` to start using the React Node Recipe Application. Explore recipes, create new ones, and edit or delete existing recipes. Enjoy!
