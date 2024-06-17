const Attendance = require("../models/attendance.model.js");
const DateFormator = require("../Services/dateFormator.js");

exports.takeOneAttendance = async (req,res)=>{
    try {
        const {rollno,student_id,takenBy,date,status} = req.body;
        const formatedDate = DateFormator(date);

        // Validate required fields
        if (!student_id || !takenBy || !date || !status || !rollno) {
            return res.status(400).send("All fields are required");
        };

        // Check if the attendance is already taken or not
        const isExist = await Attendance.findOne({rollno:rollno,date:formatedDate});
        if(isExist){
            return res.status(409).send("Attendance is already taken");
        };

        const AttendenceData = await Attendance.create({rollno:rollno,student:student_id,date:formatedDate,status:status,takenBy:takenBy});

        res.status(200).send(AttendenceData); // response

    } catch (error) {
        console.log("Attendance taking error "+error.message);
    }
};

exports.updateAttendance = async (req,res)=>{
    try {
        const date = DateFormator(req.params.date);
        const rollno = req.params.rollno;

        const status = req.body.status;
        // validation
        if(!date || !rollno || !status){
            return res.status(400).send("date, rollno and status is must.");
        }

        // Check if the attendance is already taken or not
        const isExist = await Attendance.findOne({rollno:rollno,date: {
            $gte: new Date(date).setHours(0, 0, 0, 0),
            $lt: new Date(date).setHours(23, 59, 59, 999)
        }});

        if(!isExist){
            return res.status(404).send("Attendenace is not taken for this student.")
        }

        const updatedData = await Attendance.findOneAndUpdate(
            { rollno: rollno, date: {
                $gte: new Date(date).setHours(0, 0, 0, 0),
                $lt: new Date(date).setHours(23, 59, 59, 999)
            } },
            { status: status },
            { new: true }
        );

        res.status(200).send(updatedData); // response

    } catch (error) {
        console.log("Attendance updation error "+error.message);
    }
};

// Get attendance by dept, year & date
exports.getAttendanceByDeptYearandDate = async (req,res)=>{
    try {
        const date = req.params.date;
        const dept = req.params.department;
        const year = req.params.year;

        //validation
        if(!date || !dept || !year){
            return res.status(400).send("Date, Department and year are must.")
        };

        const AttendanceList = await Attendance.find(
            {
                date: {
                    $gte: new Date(date).setHours(0, 0, 0, 0),
                    $lt: new Date(date).setHours(23, 59, 59, 999)
                }
            }
        )
            .populate({
                path: 'student',
                match: { department: dept, year: parseInt(year) },
                select: 'department year name rollno'
            })
            .populate({
                path: 'takenBy',
                select: 'year name'
            });

        if(!AttendanceList || AttendanceList.length === 0){
            return res.status(404).send(`Attendance is not taken for ${year}year-'${dept}' department at this date`);
        }

        // access populated fields
        const AttendanceData = await AttendanceList.filter((attendance)=>{
            return attendance.student && attendance.takenBy
        });

        //check if the attendance is present or not
        if(AttendanceData.length === 0){
            return res.status(404).send("Attendance is not taken");
        }

        res.status(200).send(AttendanceData); // response

    } catch (error) {
        console.log("Attendance getting error "+error.message);
    }
};

// Get attendance by dept & year
exports.getAttendanceByDeptandYear = async (req,res)=>{
    try {
        const dept = req.params.department;
        const year = req.params.year;

        // Validation
        if(!dept || !year){
            return res.status(400).send("Department and Year is must.");
        };

        const AttendanceList = await Attendance.find()
            .populate({
                path: 'student',
                match: { department: dept, year: parseInt(year) },
                select: 'name department year'
            })
            .populate({
                path: 'takenBy',
                select: 'name year'
            });

        if(!AttendanceList || AttendanceList.length === 0){
            return res.status(404).send(`Attendance is not taken for ${year}year-'${dept}' department`);
        }

        // access populated fields
        const AttendanceData = await AttendanceList.filter((attendance)=>{
            return attendance.student && attendance.takenBy
        });

        //check if the attendance is present or not
        if(AttendanceData.length === 0){
            return res.status(404).send("Attendance is not taken");
        }

        res.status(200).send(AttendanceData); // response

    } catch (error) {
        console.log("Attendance getting error "+error.message);
    }
};

exports.getAttendanceByRollno = async (req,res)=>{
    try {
        const rollno = req.params.rollno;

        //validation
        if(!rollno){
            return res.status(400).send("Rollno is must.");
        };

        const AttendanceData = await Attendance.findOne({rollno:rollno});
        if(!AttendanceData){
            return res.status(404).send("Attendance is not taken for this rollno");
        };

        res.status(200).send(AttendanceData); // response
    } catch (error) {
        console.log("Attendance getting error "+error.message);
    }
};

exports.getAttendanceByDate = async (req,res)=>{
    try {
        const date = DateFormator(req.params.date);

        // Validation
        if(!date){
            return res.status(400).send("Rollno is must.");
        };

        // Find attendance by date
        const AttendanceList = await Attendance.find({date: {
                    $gte: new Date(date).setHours(0, 0, 0, 0),
                    $lt: new Date(date).setHours(23, 59, 59, 999)
                }});

        if(!AttendanceList){
            return res.status(404).send("Attendance is not taken at this date");
        };
        
        res.status(200).send(AttendanceList); // response
    } catch (error) {
        console.log("Attendance getting error "+error.message);
    }
};