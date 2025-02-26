import express from 'express';
import path from 'path'
import { google } from 'googleapis';
import fs from 'fs/promises';
import sfs from 'fs'
// import process from 'process'
import {authenticate} from '@google-cloud/local-auth';
import { jsPDF } from "jspdf";
import cors from 'cors';
import { fileURLToPath } from 'url';
import { applyPlugin } from 'jspdf-autotable';
import multer from 'multer';
import axios from 'axios';
const app = express();
const port = 8080;
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use(express.static('./dist'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gmail API
// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
async function sendEmail(auth, options) {
  const gmail = google.gmail({version: 'v1', auth});

  const {recipients, subject, body, attachment, filename, sender = 'hlau0017@student.monash.edu'} = options;
  const content = generateEmailTemplate('users', body);
  const recipientList = Array.isArray(recipients) ? recipients.join(',') : recipients;
  const emailLines = [
    'MIME-Version: 1.0',
    `From: ${sender}`,
    `To: ${recipientList}`,
    `Subject: ${subject}`,
    "Content-Type: multipart/mixed; boundary=012boundary01",
    '',

    "--012boundary01",
    "Content-Type: multipart/alternative; boundary=012boundary02",
    '',

    "--012boundary02",
    "Content-type: text/html; charset=UTF-8", 
    "Content-Transfer-Encoding: quoted-printable",
    '',
    content,
    '',
    "--012boundary02--",
  ];

  if (attachment) {
    const base64Attachment = attachment.toString('base64');
    emailLines.push(
      '--012boundary01',
      `Content-Type: Application/pdf; name=${filename}`,
      `Content-Disposition: attachment; filename=${filename}`,
      'Content-Transfer-Encoding: base64',
      '',
      base64Attachment,
      ''
    );
  }

  emailLines.push('--012boundary01--');

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

app.post('/sendEmail', function (req, res)
{
  const {data, user} = req.body;
  if(!data){
    return res.status(400).send('No file upload.');
  }
  const attachment = generatePdf(data);

  const options = {
    recipients: user.email,
    subject: 'Registered Events',
    body: generateEmailTemplate(user.username, 'Please find the attached report.'),
    attachment: attachment,
    filename: 'Event_registered_confirmation.pdf',
  };
  authorize()
    .then(
      (auth) => {
        sendEmail(auth, options);
        res.status(200).json("sent receipt")
      }
    )
    .catch(console.error);
});

function generatePdf(data) {
  var doc = new jsPDF('p', 'pt', 'a4')
  // Supply data via script
  var body = [
             ['No', 'Event Name', 'Date', 'time', 'Description'],
             [1, data.name , data.date.toLocaleDateString(), data.date.toLocaleTimeString(), data.description]]
  // generate auto table with body
  var y = 10;
  doc.setLineWidth(2);
  doc.text(200, y = y + 30, "Event Registration Ticket");
  doc.autoTable({
      body: body,
      startY: 70,
      theme: 'grid',
               })
  // save the data to this file
  // doc.save('test.pdf')
  // const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  // sfs.writeFileSync('./test.pdf', pdfBuffer); 
  return Buffer.from(doc.output('arraybuffer'));
}

app.post('/sendBulkEmail',  upload.single('attach'), function (req, res)
{
  const {users, subject, emailBody} = req.body;
  const attach = req.file;
  const options = {
    recipients: users,
    subject: subject,
    body: emailBody,
    attachment: attach.buffer,
    filename: attach.originalname,
  };
  authorize()
    .then(
      (auth) => {
        sendEmail(auth, options);
        res.status(200)
      }
    )
    .catch(console.error);
});

/**
 * Generates an email body template.
 * 
 * @param {string} recipientName - Name of the recipient or group.
 * @param {string} content - The main content of the email.
 * @returns {string} - A formatted email body as a string.
 */
function generateEmailTemplate(recipientName, content) {
  return `
    <html>
      <body>
        <p>Dear ${recipientName},</p>
        <p>${content}</p>
        <p>Best regards,<br>MindWell</p>
      </body>
    </html>
  `;
}

app.get('/api/events', async (req, res) => {
  try {
  const response = await axios.get(
    'https://getevents-bj37ljbsda-uc.a.run.app'
  );
  const documents = response.data;
  const formattedDocs = documents.map(doc => {
      let formattedData = {...doc};
      if(formattedData.date) {
          console.log(doc.date)
          const eventDate = new Date(doc.date._seconds*1000 );
          formattedData.date = eventDate;
      }
      if(formattedData.start) {
          const eventDate = new Date(doc.start._seconds * 1000);
          formattedData.start = eventDate;
      }
      if(formattedData.end) {
          const eventDate = new Date(doc.end._seconds * 1000);
          formattedData.end = eventDate;
      }
      delete formattedData.registeredUsers
      return formattedData;
  })
  res.status(200).send(formattedDocs);
}
catch(error){
  res.status(500).send({error: 'Unable to fetch events'});
}
});


app.get('/api/knowledgehub', async (req, res) => {
  try {
    const response = await axios.get('https://getknowledgehubdoc-bj37ljbsda-uc.a.run.app');
    const documents = response.data;
    res.status(200).send(documents);
  }
  catch(error){
    res.status(500).send({error: 'Unable to fetch events'});
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});