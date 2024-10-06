import express from 'express';
import path from 'path'
import { google } from 'googleapis';
import fs from 'fs/promises';
// import process from 'process'
import {authenticate} from '@google-cloud/local-auth';
import nodemailer from 'nodemailer'

const app = express();
const port = 3000;
const router = express.Router();
// Gmail API

// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


app.get('/', (req, res) => {
    res.send('Hello from Node.js!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content =await fs.readFile(CREDENTIALS_PATH);
        const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }
  
  /**
   * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }
  
  /**
   * Load or request or authorization to call APIs.
   *
   */
  async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }
  
  /**
   * Lists the labels in the user's account.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.labels.list({
      userId: 'me',
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
      console.log('No labels found.');
      return;
    }
    console.log('Labels:');
    labels.forEach((label) => {
      console.log(`- ${label.name}`);
    });
  }
  
app.get('/getEmail', (req, res) => {
    authorize()
    .then(
        listLabels,
        res.status(200)
    )
    .catch(console.error);
    
});

async function sendEmail(auth){
  const gmail = google.gmail({version: 'v1', auth});
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hlau0017@student.monash.edu', // Your email address
      pass: 'nzkm mtqq mziq zdwz'
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'hlau0017@student.monash.edu',
    to: 'sueysueyho147@gmail.com',
    subject: 'Test Email using Gmail API',
    text: 'This is a test email sent using the Gmail API and Node.js!',
  };

  // Send the email
  const result = await transporter.sendMail(mailOptions);
  console.log('Email sent:', result);
}
app.get('/sendEmail', async (req, res) => {
  authorize()
    .then(  
      sendEmail,
      res.status(200)
    )
    .catch(console.error);
});
