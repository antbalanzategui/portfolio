import sgMail from '@sendgrid/mail';
require('dotenv').config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { name, email, message } = req.body;

  // Configure SendGrid with your API key from the .env file
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: process.env.TO_EMAIL, // Replace with your email address from the .env file
    from: process.env.FROM_EMAIL, // Replace with your website's email address from the .env file
    subject: 'New Contact Form Submission',
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
}
