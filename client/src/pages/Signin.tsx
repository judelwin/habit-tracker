import React, { useState } from 'react';
import { auth } from '../configuration';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  linkWithCredential, 
  EmailAuthProvider,
  AuthCredential,
  UserCredential
} from 'firebase/auth';
import '../Signin.css'; // Import the CSS file

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Track if user is signing up or signing in
  const [error, setError] = useState<string | null>(null); // State to hold error message

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);
      console.log('Signed in with Google');
      setError(null); // Clear any previous errors

      // Check if Google user has an existing email/password account
      const user = result.user;
      const emailCredential = EmailAuthProvider.credential(user.email!, password);

      // Attempt to link accounts if the email matches an existing account
      if (auth.currentUser) {
        try {
          await linkWithCredential(auth.currentUser, emailCredential);
          console.log('Accounts linked successfully');
        } catch (linkError) {
          console.error('Error linking accounts: ', linkError);
          // Handle linking errors if necessary
        }
      }
    } catch (error) {
      setError('Error signing in with Google.');
      console.error('Error signing in with Google: ', error);
    }
  };

  const handleSignInAnonymously = async () => {
    try {
      await signInAnonymously(auth);
      console.log('Signed in Anonymously');
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Error signing in Anonymously.');
      console.error('Error signing in Anonymously: ', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Account created with Email and Password');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Signed in with Email and Password');
      }

      // Handle account linking if needed
      const user = auth.currentUser;
      if (user && email) {
        const emailCredential = EmailAuthProvider.credential(email, password);
        try {
          await linkWithCredential(user, emailCredential);
          console.log('Accounts linked successfully');
        } catch (linkError) {
          console.error('Error linking accounts: ', linkError);
          // Handle linking errors if necessary
        }
      }
      
      setError(null); // Clear any previous errors
    } catch (error: any) {
      // Display error message based on the error code
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use.');
          break;
        case 'auth/invalid-email':
          setError('The email address is not valid.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email.');
          break;
        case 'auth/invalid-credential':
          setError('The credentials provided are invalid.');
          break;
        default:
          setError('An error occurred. Please try again.');
          break;
      }
      console.error('Error during authentication: ', error);
    }
  };

  return (
    <div className="signin-container">
      <h1>Habit Tracker</h1>
      <div className="signin-buttons">
        <button className="google-button" onClick={handleSignInWithGoogle}>
          Sign In with Google
        </button>
        <button className="anonymous-button" onClick={handleSignInAnonymously}>
          Sign In Anonymously
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleAuth} className="signin-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="submit-button">
          {isSignUp ? 'Register' : 'Sign In'}
        </button>
        <button type="button" className="switch-button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Register'}
        </button>
      </form>
    </div>
  );
};

export default Signin;
