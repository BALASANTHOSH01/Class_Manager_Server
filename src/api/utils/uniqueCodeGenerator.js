const Institute = require('../models/institute.model.js');

const generateInstituteCode = async (name, collegeCode) => {
  try {
    // Extract key parts of the name
    const words = name.split(' ').filter(word => !['College', 'University', 'Institute', 'of', 'and'].includes(word));
    const codePart = words.map(word => word.charAt(0)).join('').toUpperCase();

    // Generate initial code
    let generatedCode = `${collegeCode}-${codePart}`;

    // Ensure the code is unique
    let isUnique = await checkUniqueCode(generatedCode);
    let counter = 1;

    while (!isUnique) {
      generatedCode = `${collegeCode}-${codePart}${counter}`;
      isUnique = await checkUniqueCode(generatedCode);
      counter++;
    }

    return generatedCode;
  } catch (error) {
    console.error("Error generating institute code:", error.message);
    throw new Error("Error generating unique institute code.");
  }
};

const checkUniqueCode = async (code) => {
  try {
    const institute = await Institute.findOne({ code });
    return !institute; // true if code is unique, false if already exists
  } catch (error) {
    console.error("Error checking unique code:", error.message);
    throw new Error("Error checking unique institute code.");
  }
};

module.exports = generateInstituteCode;