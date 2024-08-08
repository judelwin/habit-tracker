import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { auth, db } from '../configuration';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { format } from 'date-fns';
import '../Home.css'
interface Habit {
  id: string;
  name: string;
  description: string;
  progress: string[];
}

interface HomeProps {
  user: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({ name: '', description: '' });

  useEffect(() => {
    if (user) {
      const fetchHabits = async () => {
        try {
          const q = query(collection(db, 'habits'), where('userId', '==', user.uid));
          const snapshot = await getDocs(q);
          const habitsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Habit));
          setHabits(habitsData);
        } catch (err) {
          console.error("Error fetching habits: ", err);
        }
      };
      fetchHabits();
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHabit({ ...newHabit, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        await addDoc(collection(db, 'habits'), {
          name: newHabit.name,
          description: newHabit.description,
          userId: user.uid,
          progress: [],
          createdAt: new Date()
        });
        setNewHabit({ name: '', description: '' });
        const q = query(collection(db, 'habits'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Habit));
        setHabits(habitsData);
      } catch (err) {
        console.error("Error adding habit: ", err);
      }
    }
  };

  const handleCheckIn = async (habitId: string) => {
    if (user) {
      try {
        const date = new Date();
        const formattedDate = format(date, "MMMM dd, yyyy hh:mm a");
        const habitRef = doc(db, 'habits', habitId);
        await updateDoc(habitRef, {
          progress: arrayUnion(formattedDate)
        });
        setHabits(habits.map(habit =>
          habit.id === habitId
            ? { ...habit, progress: [...habit.progress, formattedDate] }
            : habit
        ));
      } catch (err) {
        console.error("Error checking in: ", err);
      }
    }
  };

  const handleDeleteCheckIn = async (habitId: string, date: string) => {
    if (user) {
      try {
        const habitRef = doc(db, 'habits', habitId);
        await updateDoc(habitRef, {
          progress: arrayRemove(date)
        });
        setHabits(habits.map(habit =>
          habit.id === habitId
            ? { ...habit, progress: habit.progress.filter(d => d !== date) }
            : habit
        ));
      } catch (err) {
        console.error("Error deleting check-in: ", err);
      }
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'habits', habitId));
        setHabits(habits.filter(habit => habit.id !== habitId));
      } catch (err) {
        console.error("Error deleting habit: ", err);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Habit Tracker</h1>
        <button onClick={handleLogout} className="habit-button">Log Out</button>
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
          <button type="submit" className="habit-button">Add Habit</button>
        </form>
      </div>
      <div className="list-container">
        <ul>
          {habits
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)) // Sort by dateAdded in descending order
            .map(habit => (
              <li key={habit.id} className="habit-item">
                <div className="habit-details">
                  <h2>{habit.name}</h2>
                  <p>{habit.description}</p>
                </div>
                <div className="habit-buttons">
                  <button onClick={() => handleCheckIn(habit.id)} className="habit-button checkin-button">Check In</button>
                  <button onClick={() => handleDeleteHabit(habit.id)} className="habit-button delete-habit">Delete Habit</button>
                </div>
                <ul>
                  {habit.progress.map((date, index) => (
                    <li key={index} className="progress-item">
                      {date}
                      <button 
                        className="delete-checkin" 
                        onClick={() => handleDeleteCheckIn(habit.id, date)}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
  
  
};

export default Home;
