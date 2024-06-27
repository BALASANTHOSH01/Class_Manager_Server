require("dotenv").config();
const twilio = require('twilio');

const accountSid = 'AC820919a17e1f906271331e2e8b7d0f05';
const authToken = '4df2cb4d837ae0838f04fe56c9680616';
const fromPhoneNumber = `+918870702519`; // Your Twilio phone number

const client = new twilio(accountSid, authToken);

const message = `Hello this is a project message come from santhosh.`;
const to = `+919092042519`;

console.log("started...")

const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      to, // Text this number
      from: fromPhoneNumber // From a valid Twilio number
    });
    console.log('SMS sent successfully:', response.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

sendSMS(to,message);

module.exports = { sendSMS };

// const accountSid = 'AC820919a17e1f906271331e2e8b7d0f05';
// const authToken = '4df2cb4d837ae0838f04fe56c9680616';
// const client = require('twilio')(accountSid, authToken);

// client.verify.v2.services("VAf8cfe73cef51fbb99b56d72243e310af")
//       .verifications
//       .create({to: '+918870702519', channel: 'sms'})
//       .then(verification => console.log(verification.sid));
