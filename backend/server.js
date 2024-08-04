import express from 'express'
import admin from 'firebase-admin'
import cors from 'cors'

const app = express();

//const serviceAccount = require('./path-to-serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

app.use(express.json());
app.use(cors())
// app.post('/habits', async (req, res) => {
//   try {
//     const { userId, name, description } = req.body;
//     await db.collection('habits').add({ userId, name, description, progress: [] });
//     res.status(201).send('Habit added');
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// app.get('/habits', async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const snapshot = await db.collection('habits').where('userId', '==', userId).get();
//     const habits = snapshot.docs.map(doc => doc.data());
//     res.status(200).json(habits);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// app.post('/checkin', async (req, res) => {
//   try {
//     const { habitId, date } = req.body;
//     const habitRef = db.collection('habits').doc(habitId);
//     await habitRef.update({
//       progress: admin.firestore.FieldValue.arrayUnion(date)
//     });
//     res.status(201).send('Check-in added');
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(process.env.PORT, () => console.log('Server running on port 3000'));
