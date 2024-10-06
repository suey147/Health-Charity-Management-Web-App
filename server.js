import express from 'express';
import path from 'path'
import { google } from 'googleapis';
import fs from 'fs/promises';
import sfs from 'fs'
// import process from 'process'
import {authenticate} from '@google-cloud/local-auth';

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
        const content =await fs.readFile(TOKEN_PATH);
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

  // Took https://stackoverflow.com/questions/50639036/send-mail-with-attachment-pdf-using-gmail-api as example
async function sendEmail(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const fileName = "A2BasicAppReport.pdf";
  const attach = new Buffer.from(sfs.readFileSync("./"+fileName)).toString("base64");
  const emailBody = 'My Email Message';
  const emailLines = [
    'MIME-Version: 1.0',
    'From: hlau0017@student.monash.edu',
    'To: sueysueyho147@gmail.com',
    'Subject: Test Subject',
    "Content-Type: multipart/mixed; boundary=012boundary01",
    '',

    "--012boundary01",
    "Content-Type: multipart/alternative; boundary=012boundary02",
    '',

    "--012boundary02",
    "Content-type: text/html; charset=UTF-8", 
    "Content-Transfer-Encoding: quoted-printable",
    '',
    emailBody,
    '',
    "--012boundary02--",
    "--012boundary01",
    "Content-Type: Application/pdf; name=A2BasicAppReport.pdf",
    'Content-Disposition: attachment; filename=A2BasicAppReport.pdf',
    "Content-Transfer-Encoding: base64",
    '',
    attach,
    "--012boundary01--",
  ];

  const email = emailLines.join('\n');
  const base64Email = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64Email
      }
    });
    console.log('Email sent:', res.data);
  } catch(error){
    console.error('Error sending email:', error);
  }

}

app.get('/sendEmail', (req, res) => 
{
  authorize()
    .then(
        sendEmail,
        res.status(200)
    )
    .catch(console.error);
});
