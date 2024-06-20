const moment = require('moment');

// Function to parse and format the date
const formatDate = (dateStr) => {
    // Try different formats
    const formats = ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
    let date;

    for (const format of formats) {
        date = moment(dateStr, format, true);
        if (date.isValid()) {
            return date.format("YYYY-MM-DD"); // Convert to ISO 8601 format
        }
    }
    throw new Error("Invalid date format");
};

module.exports = formatDate;