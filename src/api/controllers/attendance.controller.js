const Attendance = require("../models/attendance.model.js");
const DateFormator = require("../utils/dateFormator.js");
const Student = require("../models/student.model.js");
const isCurrentDate = require("../utils/isCurrentDate.js");

// Take attendance for a student
exports.takeOneAttendance = async (req, res) => {
  try {
    const institute = req.instituteId; 
    const {
      semester,
      rollno,
      student_id,
      staff_id,
      date,
      status,
    } = req.body;
    const formatedDate = DateFormator(date);

    // Validate required fields
    if (
      !student_id ||
      !staff_id ||
      !date ||
      !status ||
      !rollno || 
      !institute
    ) {
      return res.status(400).send("All fields are required");
    }

    const studentDetails = await Student.findById(student_id);

    // Validate if the student exists and matches the roll number and institute
    if (
      !studentDetails ||
      studentDetails.rollno !== rollno 
    ) {
      return res
        .status(409)
        .send(
          "Student ID, roll number do not match, or student does not exist."
        );
    };

    // Check if the date is the current date
    if (!isCurrentDate(formatedDate)) {
      return res.status(400).send("Attendance can only be taken for the current date.");
    }

    if(studentDetails.institute.toString() !== institute.toString()){
      return res.status(409).send("Institute is not matching");
    };

    // Find the attendance document for the student
    let attendance = await Attendance.findOne({
      rollno: rollno,
      student: student_id,
      institute: institute,
    });

    if (!attendance) {
      // Create a new attendance document if not found
      attendance = await Attendance.create({
        student: student_id,
        rollno: rollno,
        semester: semester,
        institute: institute,
        attendance: [],
      });
    }

    // Check if the attendance for the given date already exists
    const isAttendanceExist = attendance.attendance.some(
      (details) => details.date.getTime() === new Date(formatedDate).getTime()
    );

    if (isAttendanceExist) {
      return res
        .status(409)
        .send("Attendance is already taken for the given date.");
    }

    // Create attendance detail
    const attendanceDetail = {
      status: status,
      date: new Date(formatedDate),
      staff: staff_id,
    };

    // Add the attendance detail to the appropriate array
    attendance.attendance.push(attendanceDetail);

    // Save the updated attendance document
    await attendance.save();

    res.status(200).send(attendance); // response
  } catch (error) {
    console.log("Attendance taking error: " + error.message);
    res.status(500).send("An error occurred while recording attendance.");
  }
};

// Take attendance for multiple students
exports.takeManyAttendance = async (req, res) => {
  try {
    const institute = req.instituteId;
    const attendanceList = req.body;

    if (!Array.isArray(attendanceList)) {
      return res.status(400).send("Given attendance details is not an array.");
    }

    const results = {
      successes: [],
      errors: [],
    };

    for (const attendanceRecord of attendanceList) {
      const {
        semester,
        rollno,
        student_id,
        staff_id,
        date,
        status,
      } = attendanceRecord;
      const formattedDate = DateFormator(date);

      // Validate required fields
      if (
        !student_id ||
        !staff_id ||
        !date ||
        !status ||
        !rollno ||
        !institute
      ) {
        results.errors.push({
          record: attendanceRecord,
          message: "All fields are required",
        });
        continue;
      }

      try {
        const studentDetails = await Student.findById(student_id);

        // Validate if the student exists and matches the roll number and institute
        if (
          !studentDetails ||
          studentDetails.rollno !== rollno
        ) {
          results.errors.push({
            record: attendanceRecord,
            message:
              "Student ID, roll number, or institute ID do not match, or student does not exist.",
          });
          continue;
        };

         // Check if the date is the current date
      if (!isCurrentDate(formattedDate)) {
        results.errors.push({
          record: attendanceRecord,
          message: "Attendance can only be taken for the current date.",
        });
        continue;
      }

        if(studentDetails.institute.toString() !== institute.toString()){
          return res.status(409).send("Institute is not matching");
        };

        // Find the attendance document for the student
        let attendance = await Attendance.findOne({
          rollno: rollno,
          student: student_id,
          institute: institute,
        });

        if (!attendance) {
          // Create a new attendance document if not found
          attendance = new Attendance({
            student: student_id,
            rollno: rollno,
            semester: semester,
            institute: institute,
            attendance: [],
          });
          await attendance.save();
        };

        // Check if the attendance for the given date already exists
        const isAttendanceExist = attendance.attendance.some(
          (details) =>
            details.date.getTime() === new Date(formattedDate).getTime()
        );

        if (isAttendanceExist) {
          results.errors.push({
            record: attendanceRecord,
            message: "Attendance is already taken for the given date.",
          });
          continue;
        }

        // Create attendance detail
        const attendanceDetail = {
          status: status,
          date: new Date(formattedDate),
          staff: staff_id,
        };

        // Add the attendance detail to the appropriate array
        attendance.attendance.push(attendanceDetail);

        // Save the updated attendance document
        await attendance.save();

        results.successes.push(attendanceRecord);
      } catch (err) {
        console.error(
          "Error processing record for rollno " + rollno + ": " + err.message
        );
        results.errors.push({
          record: attendanceRecord,
          message: "An error occurred while recording attendance.",
        });
      }
    }

    res.status(200).send(results); // Send consolidated response
  } catch (error) {
    console.log("Attendance taking error: " + error.message);
    res.status(500).send("An error occurred while recording attendance.");
  }
};

// Update attendance status for a specific rollno
exports.updateAttendance = async (req, res) => {
  try {
    const institute = req.instituteId;
    const date = DateFormator(req.params.date);
    const rollno = req.params.rollno;
    const { status, staff } = req.body; // Added staff to request body

    // Validation
    if (!date || !rollno || !status || !staff || !institute) {
      return res
        .status(400)
        .send("Date, rollno, status, staff_id, and institute are required.");
    }

    // Find the attendance document
    const attendance = await Attendance.findOne({
      rollno,
      institute: institute,
    });

    if (!attendance) {
      return res
        .status(404)
        .send("Attendance record not found for this rollno.");
    }

    // Check if the attendance for the given date exists
    const formattedDate = new Date(date);

    const attendanceDetail = attendance.attendance.find(
      (data) => data.date.getTime() === formattedDate.getTime()
    );

    // Check if the attendance is found
    if (!attendanceDetail) {
      return res
        .status(404)
        .send("Attendance record not found for the given date.");
    }

    // Update the status and staff in the attendance detail
    attendanceDetail.status = status;
    attendanceDetail.staff = staff;

    await attendance.save();

    res.status(200).send(attendance); // response
  } catch (error) {
    console.log("Attendance updation error: " + error.message);
    res.status(500).send("An error occurred while updating attendance.");
  }
};

// Update many students attendance
exports.updateManyAttendance = async (req, res) => {
  try {
    const institute = req.instituteId;
    const attendanceList = req.body;

    // Check if the input is an array
    if (!Array.isArray(attendanceList)) {
      return res.status(400).send("Details is not an array");
    }

    const results = {
      successes: [],
      errors: [],
    };

    for (const attendanceRecord of attendanceList) {
      const { rollno, staff, date, status } = attendanceRecord;

      // Validation
      if (!date || !rollno || !status || !staff || !institute) {
        results.errors.push({
          record: attendanceRecord,
          message:
            "Date, rollno, status, staff_id, and institute are required.",
        });
        continue;
      }

      try {
        // Find the attendance document
        const attendance = await Attendance.findOne({
          rollno,
          institute: institute,
        });

        if (!attendance) {
          results.errors.push({
            record: attendanceRecord,
            message: "Attendance record not found for this rollno.",
          });
          continue;
        }

        // Check if the attendance for the given date exists
        const formattedDate = new Date(DateFormator(date));
        const attendanceDetail = attendance.attendance.find(
          (data) => data.date.getTime() === formattedDate.getTime()
        );

        if (!attendanceDetail) {
          results.errors.push({
            record: attendanceRecord,
            message: "Attendance record not found for the given date.",
          });
          continue;
        }

        // Update the status and staff in the attendance detail
        attendanceDetail.status = status;
        attendanceDetail.staff = staff;

        // Save the updated attendance document
        await attendance.save();
        results.successes.push(attendanceRecord);
      } catch (error) {
        console.error(
          "Error updating record for rollno " + rollno + ": " + error.message
        );
        results.errors.push({
          record: attendanceRecord,
          message: "An error occurred while updating attendance.",
        });
      }
    }

    res.status(200).send(results); // Send consolidated response
  } catch (error) {
    console.error("Attendance updating error: " + error.message);
    res.status(500).send("An error occurred while updating attendance.");
  }
};

// Get attendance by department, year, and date
exports.getAttendanceByDeptYearandDate = async (req, res) => {
  try {
    const date = DateFormator(req.params.date);
    const dept = req.params.department;
    const year = req.params.year;
    const institute = req.instituteId;

    // Validation
    if (!date || !dept || !year || !institute) {
      return res
        .status(400)
        .send("Date, department, year, and institute are required.");
    }

    // Find attendance by date and populate student and staff fields
    const AttendanceList = await Attendance.find({
      institute: institute,
      "attendance.date": {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
    }).populate({
      path: "student",
      match: { department: dept, year: parseInt(year) },
      select: "department year name rollno",
    });

    if (!AttendanceList || AttendanceList.length === 0) {
      return res
        .status(404)
        .send(
          `Attendance is not taken for ${year} year-'${dept}' department on this date.`
        );
    }

    res.status(200).send(AttendanceList); // response
  } catch (error) {
    console.log("Attendance getting error: " + error.message);
    res.status(500).send("An error occurred while retrieving attendance.");
  }
};

// Get attendance by department and year
exports.getAttendanceByDeptandYear = async (req, res) => {
  try {
    const dept = req.params.department;
    const year = req.params.year;
    const semester = req.body.semester;
    const institute = req.instituteId;

    // Validation
    if (!dept || !year || !semester || !institute) {
      return res
        .status(400)
        .send("Department, year, semester, and institute are required.");
    }

    // Find attendance by department and year and populate student and staff fields
    const AttendanceList = await Attendance.find({
      semester: semester,
      institute: institute,
    }).populate({
      path: "student",
      match: { department: dept, year: parseInt(year) },
      select: "name department year ",
    });

    if (!AttendanceList || AttendanceList.length === 0) {
      return res
        .status(404)
        .send(`Attendance is not taken for ${year} year-'${dept}' department.`);
    }

    res.status(200).send(AttendanceList); // response
  } catch (error) {
    console.log("Attendance getting error: " + error.message);
    res.status(500).send("An error occurred while retrieving attendance.");
  }
};

// Get Own attendance by roll number
exports.getOwnAttendanceByRollno = async (req, res) => {
  try {
    const rollno = req.params.rollno;

    // check the user is authorized
    if(rollno !== req.user.rollno){
      return res.status(403).send("Accessing other students data is restricted.");
    };

    const institute = req.instituteId;

    // Validation
    if (!rollno || !institute) {
      return res.status(400).send("Roll number and institute are required.");
    }

    const AttendanceData = await Attendance.findOne({
      rollno,
      institute: institute,
    }).populate({
      path: 'student',
      select: 'name rollno department year email totalPresent totalAbsent'
    })
    .populate({
      path: 'attendance.staff',
      select: 'name' // Add other fields as needed
    });

    if (!AttendanceData) {
      return res
        .status(404)
        .send("Attendance is not taken for this roll number.");
    }

    res.status(200).send(AttendanceData); // response
  } catch (error) {
    console.log("Attendance getting error: " + error.message);
    res.status(500).send("An error occurred while retrieving attendance.");
  }
};

// Get attendance by roll number
exports.getAttendanceByRollno = async (req, res) => {
  try {
    const rollno = req.params.rollno;
    const institute = req.instituteId;

    // Validation
    if (!rollno || !institute) {
      return res.status(400).send("Roll number and institute are required.");
    }

    const AttendanceData = await Attendance.findOne({
      rollno,
      institute: institute,
    }).populate({
      path: 'student',
      select: 'name rollno department year email totalPresent totalAbsent'
    })
    .populate({
      path: 'attendance.staff',
      select: 'name' // Add other fields as needed
    });

    if (!AttendanceData) {
      return res
        .status(404)
        .send("Attendance is not taken for this roll number.");
    }

    res.status(200).send(AttendanceData); // response
  } catch (error) {
    console.log("Attendance getting error: " + error.message);
    res.status(500).send("An error occurred while retrieving attendance.");
  } 
}; 

// Get attendance by date
exports.getAttendanceByDate = async (req, res) => {  
  try {
    const date = DateFormator(req.params.date);
    const institute = req.instituteId;
''
    console.log("date :"+date +" "+ "InstituteID :"+institute);

    // Validation
    if (!date || !institute) {
      return res.status(400).send("Date and institute are required.");
    }


    // Find attendance by date
    const AttendanceList = await Attendance.find({
      institute: institute,
      "attendance.date": {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
    })
      .populate("student", "name rollno department year")
      .populate({
        path: 'attendance.staff',
        select: 'name' // Add other fields as needed 
      });

    if (!AttendanceList || AttendanceList.length === 0) {
      return res.status(404).send("Attendance is not taken on this date.");
    }

    Object.values(AttendanceList).map((details)=>{
      console.log("attendance Data : "+details);
    })


    res.status(200).send(AttendanceList); // response 
  } catch (error) {
    console.log("Attendance getting error: " + error.message);
    res.status(500).send("An error occurred while retrieving attendance.");
  }
};

