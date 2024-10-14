const {applyPlugin} = require("jspdf-autotable");
const {authenticate} = require("@google-cloud/local-auth");
const {google} = require("googleapis");
const fs = require("fs/promises");
const {jsPDF: JSPDF} = require("jspdf");

// Gmail API
// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
];
const TOKEN_PATH = "token.json";
const CREDENTIALS_PATH = "credentials.json";
applyPlugin(JSPDF);
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
    type: "authorized_user",
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
/**
 * send email function
 * @param {OAuth2Client} auth
 * @param {JSON} options
 * @return {Promise<void>}
 */
async function sendEmail(auth, options) {
  const gmail = google.gmail({version: "v1", auth});
  const {recipients, subject, body, attachment, filename,
    sender = "hlau0017@student.monash.edu"} = options;
  const content = generateEmailTemplate("users", body);
  const recipientList = Array.isArray(recipients) ?
    recipients.join(",") : recipients;
  const emailLines = [
    "MIME-Version: 1.0",
    `From: ${sender}`,
    `To: ${recipientList}`,
    `Subject: ${subject}`,
    "Content-Type: multipart/mixed; boundary=012boundary01",
    "",

    "--012boundary01",
    "Content-Type: multipart/alternative; boundary=012boundary02",
    "",

    "--012boundary02",
    "Content-type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: quoted-printable",
    "",
    content,
    "",
    "--012boundary02--",
  ];

  if (attachment) {
    const base64Attachment = attachment.toString("base64");
    emailLines.push(
        "--012boundary01",
        `Content-Type: Application/pdf; name=${filename}`,
        `Content-Disposition: attachment; filename=${filename}`,
        "Content-Transfer-Encoding: base64",
        "",
        base64Attachment,
        "",
    );
  }

  emailLines.push("--012boundary01--");

  const email = emailLines.join("\n");
  const base64Email = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  try {
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64Email,
      },
    });
    console.log("Email sent:", res.data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
/**
 * Generate a PDF document.
 * @param {any} data - The data used to generate the PDF.
 * @return {Buffer} - The generated PDF as a buffer.
 */
function generatePdf(data) {
  const doc = new JSPDF("p", "pt", "a4");
  // Supply data via script
  const body = [
    ["No", "Event Name", "Date", "time", "Description"],
    [1, data.name, data.start,
      data.start, data.description]];
  // generate auto table with body
  let y = 10;
  doc.setLineWidth(2);
  doc.text(200, y = y + 30, "Event Registration Ticket");
  doc.autoTable({
    body: body,
    startY: 70,
    theme: "grid",
  });
  return Buffer.from(doc.output("arraybuffer"));
}


/**
 * Generates an email body template.
 *
 * @param {string} recipientName - Name of the recipient or group.
 * @param {string} content - The main content of the email.
 * @return {string} - A formatted email body as a string.
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

module.exports = {
  authorize,
  sendEmail,
  generatePdf,
  generateEmailTemplate,
};
