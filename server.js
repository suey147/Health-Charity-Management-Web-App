import express from 'express';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
const app = express();
const port = 3000;
dotenv.config({path: './.env'});
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.get('/', (req, res) => {
    res.send('Hello from Node.js!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/send-email', async (req, res) => {
    const msg = {
        to: 'sueysueyho147@gmail.com', // Change to your recipient
        from: 'test@example.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    try {
        const response = await sgMail.send(msg);
        console.log(response)
        res.status(200).send( {message: 'Email sent successfully'});
    } catch (error) {
        console.error(error);
        console.error(error.response.body.errors);
        res.status(500).send({ message: 'An error occurred while sending the email'});
    }
})
