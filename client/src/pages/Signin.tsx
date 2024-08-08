import React from 'react'
import { auth} from '../configuration';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



const Signin: React.FC = () => {
    return (
        <>
        <h1>Habit Tracker</h1>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
          Sign In with Google
        </button>
        </>
    )
}

export default Signin