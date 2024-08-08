# Habit Tracker

## Overview

The Habit Tracker is a web application designed to help users track and manage their habits. It offers multiple authentication methods including Google, email/password, and anonymous sign-in. Users can add, check in, and delete habits, as well as track their progress.

## Features

- **Authentication**: Sign in with Google, email/password, or anonymously.
- **Habit Management**: Add, check in, and delete habits.
- **Progress Tracking**: View and delete check-ins for each habit.
- **Error Handling**: Provides user feedback for various authentication and operation errors.

## Technologies Used

- **Frontend**: React, TypeScript
- **Backend**: Firebase
  - Authentication: Google, Email/Password, Anonymous
  - Firestore: Real-time database for habit tracking

## Setup

### Prerequisites

- Node.js (version 14 or higher)
- Firebase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Start the development server**
    ```bash
    npm run dev
    ```
    The application will be available at http://localhost:3000.
    
    <br/>***Configuration***<br/>
    **Firebase Configuration**
    <br/>
    Update src/configuration.ts with your Firebase project's configuration:
    ```bash
        import { initializeApp } from 'firebase/app';
        import { getAuth } from 'firebase/auth';
        import { getFirestore } from 'firebase/firestore';

        const firebaseConfig = {
        apiKey: 'YOUR_API_KEY',
        authDomain: 'YOUR_AUTH_DOMAIN',
        projectId: 'YOUR_PROJECT_ID',
        storageBucket: 'YOUR_STORAGE_BUCKET',
        messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
        appId: 'YOUR_APP_ID'
        };

        const app = initializeApp(firebaseConfig);
        export const auth = getAuth(app);
        export const db = getFirestore(app);

    ```