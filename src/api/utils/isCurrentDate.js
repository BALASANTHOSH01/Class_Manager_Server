const isCurrentDate = (date) =>{
    const today = new Date();
    const formattedDate = new Date(date);
    
    // Set times to 0 to ignore the time part
    today.setHours(0, 0, 0, 0);
    formattedDate.setHours(0, 0, 0, 0);
  
    return today.getTime() === formattedDate.getTime();
};

module.exports = isCurrentDate;