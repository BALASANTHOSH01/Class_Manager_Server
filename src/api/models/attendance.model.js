const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    rollno:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
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