// pages/api/webhook/route.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const secret = process.env.SECRET_KEY; // Make sure to set your secret key in the environment variables
    const signature = req.headers['chapa-signature'] || req.headers['x-chapa-signature'];

    // Generate the hash using your secret key
    const hash = crypto.createHmac('sha256', secret)
                       .update(JSON.stringify(req.body))
                       .digest('hex');

    // Validate the signature
    if (hash === signature) {
      // Signature is valid, process the event
      const event = req.body;

      // You can now handle the event, e.g., update payment status in your database
      console.log('Received event:', event);

      // Respond with a 200 status to acknowledge receipt of the event
      res.status(200).send('Event received successfully');
    } else {
      // Invalid signature, reject the request
      console.error('Invalid signature');
      res.status(400).send('Invalid signature');
    }
  } else {
    // Respond with 405 Method Not Allowed if the request is not a POST
    res.status(405).send('Method Not Allowed');
  }
}
