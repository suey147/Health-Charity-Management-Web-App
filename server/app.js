const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
// initialze express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Serve the Vue.js frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const serviceAccount = require('./fit5032-assignment-ce36f-firebase-adminsdk-c3nrq-ddbdcc874f.json');
initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password  = req.body.password;
    try {
        const doc = await db.collection('Users').get();
        doc.forEach((doc) => {
            if (doc.data().username == username && doc.data().password == password)
            {
                res.json({message: "Login successful", user: doc.data()});
            }
            else{
                res.json({message: "Incorrect user name or password"});
            }
        });
        
      } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
      }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
