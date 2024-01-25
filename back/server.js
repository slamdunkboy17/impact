require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:3000' }));

const PORT = process.env.PORT || 3001;
const { google } = require('googleapis');

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_CREDENTIALS_FILE, // Use environment variable
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  return sheets;
}

// Endpoint to get all data
app.get('/api/data', async (req, res) => {
  const sheets = await authenticate();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID, // Use environment variable
    range: 'Sheet1!A:E', // Adjust as needed
  });

  res.send(response.data);
});

// Updated endpoint to get the most recent user data based on email address
app.get('/api/user-data', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log("Received request for user email:", userEmail);

    const sheets = await authenticate();
    console.log("Google Sheets API authenticated");

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:E',
    });
    console.log("Data fetched from Google Sheets");

    const data = response.data.values;

    // Sort the data by the "Submitted At" column (assuming it's in column B)
    data.sort((a, b) => {
      const submittedAtA = new Date(a[1]); // Change index to match the column
      const submittedAtB = new Date(b[1]); // Change index to match the column
      return submittedAtB - submittedAtA; // Sort in descending order (newest first)
    });

    // Find the most recent user data entry for the provided email
    const mostRecentUserData = data
      .filter(row => row[0].toLowerCase() === userEmail.toLowerCase())
      .map(row => ({
        email: row[0],
        teamFocus: row[2],
        winningFocus: row[3],
        leaderType: row[4]
      }))[0]; // Select the first entry, which is the most recent

    if (mostRecentUserData) {
      res.send(mostRecentUserData);
    } else {
      res.status(404).send('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
