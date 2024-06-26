const cron = require('node-cron');
const { sendSMS } = require('../services/smsService');
const Student = require("../models/student.model.js");
const Institute = require("../models/institute.model.js");

const smsScheduler = async () => {
  try {
    // Fetch all institutes with notifyParents set to true
    const institutes = await Institute.find({ notifyParents: true });

    institutes.forEach(institute => {
      const { sendTime } = institute.smsPreferences;
      const [hour, minute] = sendTime.split(':');

      // Schedule SMS based on each institute's preferences
      cron.schedule(`${minute} ${hour} * * *`, async () => {
        // Fetch all students of this institute with notifyParents set to true
        const students = await Student.find({ institute: institute._id, notifyParents: true });

        students.forEach(async student => {
          const message = `Your son/daughter ${student.name} is absent today. Please take necessary action.`;
          await sendSMS(student.parentNumber, message);
        });

        console.log(`SMS notifications sent to parents of institute ${institute.name}`);
      });
    });
  } catch (error) {
    console.error('Error scheduling SMS notifications:', error);
  }
};

module.exports = smsScheduler;
