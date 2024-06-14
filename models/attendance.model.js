const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Student'
    },
    date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum: ['present', 'absent'],
        required:true
    },
    takenBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Staff"
    },
});

module.exports = mongoose.model("Attendance",attendanceSchema);