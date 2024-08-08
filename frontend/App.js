import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config here
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: '', description: '' });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchHabits = async () => {
        const snapshot = await db.collection('habits').where('userId', '==', user.uid).get();
        const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHabits(habitsData);
      };
      fetchHabits();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHabit({ ...newHabit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await db.collection('habits').add({ ...newHabit, userId: user.uid, progress: [] });
      setNewHabit({ name: '', description: '' });
    }
  };

  const handleCheckIn = async (habitId) => {
    if (user) {
      const date = new Date().toISOString().split('T')[0];
      await db.collection('habits').doc(habitId).update({
        progress: firebase.firestore.FieldValue.arrayUnion(date)
      });
    }
  };

  return (
    <div className="App">
      <h1>Habit Tracker</h1>
      {user ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={newHabit.name}
              onChange={handleChange}
              placeholder="Habit Name"
              required
            />
            <textarea
              name="description"
              value={newHabit.description}
              onChange={handleChange}
              placeholder="Habit Description"
              required
            />
            <button type="submit">Add Habit</button>
          </form>
          <ul>
            {habits.map(habit => (
              <li key={habit.id}>
                <h2>{habit.name}</h2>
                <p>{habit.description}</p>
                <button onClick={() => handleCheckIn(habit.id)}>Check In</button>
                <ul>
                  {habit.progress.map((date, index) => (
                    <li key={index}>{date}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={() => firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())}>
          Sign In with Google
        </button>
      )}
    </div>
  );
}

export default App;
