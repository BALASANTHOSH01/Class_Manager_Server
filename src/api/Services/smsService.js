// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
// const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
// const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

// const client = new twilio(accountSid, authToken);

// const sendSMS = async (to, message) => {
//   try {
//     const response = await client.messages.create({
//       body: message,
//       to, // Text this number
//       from: fromPhoneNumber // From a valid Twilio number
//     });
//     console.log('SMS sent successfully:', response.sid);
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//   }
// };

// module.exports = { sendSMS };
