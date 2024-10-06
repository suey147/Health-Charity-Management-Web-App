import express from 'express';
import nodemailer from 'nodemailer'

const app = express();
const port = 3000;
const router = express.Router();

app.get('/', (req, res) => {
    res.send('Hello from Node.js!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function sendEmail(){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hlau0017@student.monash.edu',
      pass: 'nzkm mtqq mziq zdwz'
    },
  });
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
  await sendEmail();
});
