const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Update with your service account key path

const app = express();


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle trade submissions
app.post('/submit-trade', async (req, res) => {
    try {
        const { crypto, amount } = req.body;
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // Add trade to Firestore
        await db.collection('trades').add({
            crypto,
            amount: parseFloat(amount),
            timestamp
        });

        res.status(200).send('Trade submitted successfully');
    } catch (error) {
        console.error('Error submitting trade:', error);
        res.status(500).send('Error submitting trade');
    }
});

// Start server
const port = process.env.PORT || 3000;
const host = '0.0.0.0';  // This will allow connections from any IP address

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});