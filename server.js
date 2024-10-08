import express from 'express';
import path from 'path'
import { google } from 'googleapis';
import fs from 'fs/promises';
import sfs from 'fs'
// import process from 'process'
import {authenticate} from '@google-cloud/local-auth';
import multer from 'multer';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import cors from 'cors'

const app = express();
const port = 3000;
const router = express.Router();
app.use(cors());
app.use(express.json());

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
async function sendEmail(auth, options) {
  const gmail = google.gmail({version: 'v1', auth});

  const {recipients, subject, body, attachment, filename, sender = 'hlau0017@student.monash.edu'} = options;

  const recipientList = Array.isArray(recipients) ? recipients.join(',') : recipients;
  console.log(recipients)
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
    body,
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
    body: generateEmailTemplate(user.email, 'Please find the attached report.'),
    attachment: attachment,
    filename: 'Event_registered_confirmation.pdf',
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

function generatePdf(data) {
  var doc = new jsPDF('p', 'pt', 'a4')
  // Supply data via script
  var body = [
             ['No', 'Event Name', 'Date', 'time'],
             [1, data.name , data.date, data.date],
             ]
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

app.post('/sendBulkEmail', function (req, res)
{
  const {users} = req.body;
  
  const htmlTemplatePath = path.join(process.cwd(), 'emailTemplate.html');
  let emailBody = sfs.readFileSync(htmlTemplatePath, 'utf8');


  const options = {
    recipients: users,
    subject: 'MindWell Monthly letter',
    body: emailBody,
    attachment: null,
    filename: 'Event in MindWell',
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

