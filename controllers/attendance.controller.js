const Attendance = require("../models/attendance.model.js");

exports.takeAttendance = async (req,res)=>{
    try {
        const {student_id,takenBy,date,status} = req.body;

        // Check if the attendance is already taken or not
        const isExist = await Attendance.findOne({student:student_id,date:date})
        if(isExist){
            return res.status(409).send("Attendance is already taken");
        }

        const AttendenceData = await Attendance.create({student_id,date,status,takenBy});
        res.status(200).send(AttendenceData);

    } catch (error) {
        console.log("Attendance taking error "+error.message);
    }
};

exports.updateAttendance = async (req,res)=>{
    try {
        const student_id = req.params.studentid;
        const date = req.params.date;

        // Check if the attendance is already taken or not
        const isExist = await Attendance.findOne({student:student_id,date:date});
        if(!isExist){
            return res.status(404).send("Attendenace is not taken for this student.")
        }

        const updatedData = await Attendance.findOneAndUpdate(
            {student:student_id,date:date},
            req.body,
            {new:true}
        );
        res.status(200).send(updatedData);

    } catch (error) {
        console.log("Attendance updation error "+error.message);
    }
};

exports.getAttendanceByDeptYearandDate = async (req,res)=>{
    try {
        const date = req.params.date;
        const dept = req.params.department;
        const year = req.params.year;

        const AttendanceList = await Attendance.find({date:date}).populate('student').populate('takenBy');
        if(!AttendanceList || AttendanceList.length === 0){
            return res.status(404).send("Attendance is not taken");
        }

        // access populated fields
        const AttendanceData = await AttendanceList.filter((attendance)=>{
            return attendance.student.department === dept && attendance.takenBy.year === year
        });

        res.status(200).send(AttendanceData);

    } catch (error) {
        console.log("Attendance getting error "+error.message);
    }
};

exports.getAttendanceByDate = async (req,res)=>{
    try {
        const date = req.params.date;
        const AttendanceList = await Attendance.find({date:date});
        if(!AttendanceList){
            return res.status(404).send("Attendance is not taken");
        }
        res.status(200).send(AttendanceList);
    } catch (error) {
        console.log("Attendance getting error "+error.message);
    }
};