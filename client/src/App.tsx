import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './configuration';
import { onAuthStateChanged, User } from 'firebase/auth';
import Signin from './pages/Signin';
import Home from './pages/Home';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <Signin />}
        />
        <Route
          path="/"
          element={user ? <Home user={user} /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
