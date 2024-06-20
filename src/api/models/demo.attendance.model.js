const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
    status:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type:Date,
        required:true
    },
    staff:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required:true
    },
});


const demoAttendanceSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Student'
    },
    rollno:{
        type:String,
        required:true,
       unique:true,
    },
    semester: {
        type: String, 
        required: true
    },
    attendance:{
        type:[attendanceRecordSchema],
        default:[]
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
});

module.exports = mongoose.model("Attendance",demoAttendanceSchema);