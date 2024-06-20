const Attendance = require("../models/demo.attendance.model.js");
const DateFormator = require("../Services/dateFormator.js");
const Student = require("../models/student.model.js");

// Take attendance for a student
exports.takeOneAttendance = async (req, res) => {
  try {
    const {
      semester,
      rollno,
      student_id,
      staff_id,
      date,
      status,
      institute_id,
    } = req.body;
    const formatedDate = DateFormator(date);

    // Validate required fields
    if (
      !student_id ||
      !staff_id ||
      !date ||
      !status ||
      !rollno ||
      !institute_id
    ) {
      return res.status(400).send("All fields are required");
    }

    const studentDetails = await Student.findById(student_id);

    // Validate if the student exists and matches the roll number and institute
    if (
      !studentDetails ||
      studentDetails.rollno !== rollno ||
      studentDetails.institute.toString() !== institute_id
    ) {
      return res
        .status(409)
        .send(
          "Student ID, roll number, or institute ID do not match, or student does not exist."
        );
    }

    // Find the attendance document for the student
    let attendance = await Attendance.findOne({
      rollno: rollno,
      student: student_id,
      institute: institute_id,
    });

    if (!attendance) {
      // Create a new attendance document if not found
      attendance = await Attendance.create({
        student: student_id,
        rollno: rollno,
        semester: semester,
        institute: institute_id,
        attendance: [],
      });
      console.log("document created");
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
        institute_id,
      } = attendanceRecord;
      const formattedDate = DateFormator(date);

      // Validate required fields
      if (
        !student_id ||
        !staff_id ||
        !date ||
        !status ||
        !rollno ||
        !institute_id
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
          studentDetails.rollno !== rollno ||
          studentDetails.institute.toString() !== institute_id
        ) {
          results.errors.push({
            record: attendanceRecord,
            message:
              "Student ID, roll number, or institute ID do not match, or student does not exist.",
          });
          continue;
        }

        // Find the attendance document for the student
        let attendance = await Attendance.findOne({
          rollno: rollno,
          student: student_id,
          institute: institute_id,
        });

        if (!attendance) {
          // Create a new attendance document if not found
          attendance = new Attendance({
            student: student_id,
            rollno: rollno,
            semester: semester,
            institute: institute_id,
            attendance: [],
          });
          await attendance.save();
        }

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
    const date = DateFormator(req.params.date);
    const rollno = req.params.rollno;
    const { status, staff, institute_id } = req.body; // Added staff to request body

    // Validation
    if (!date || !rollno || !status || !staff || !institute_id) {
      return res
        .status(400)
        .send("Date, rollno, status, staff_id, and institute_id are required.");
    }

    // Find the attendance document
    const attendance = await Attendance.findOne({
      rollno,
      institute: institute_id,
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
      const { rollno, staff, date, status, institute_id } = attendanceRecord;

      // Validation
      if (!date || !rollno || !status || !staff || !institute_id) {
        results.errors.push({
          record: attendanceRecord,
          message:
            "Date, rollno, status, staff_id, and institute_id are required.",
        });
        continue;
      }

      try {
        // Find the attendance document
        const attendance = await Attendance.findOne({
          rollno,
          institute: institute_id,
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
    const institute_id = req.body.institute_id;

    // Validation
    if (!date || !dept || !year || !institute_id) {
      return res
        .status(400)
        .send("Date, department, year, and institute_id are required.");
    }

    // Find attendance by date and populate student and staff fields
    const AttendanceList = await Attendance.find({
      institute: institute_id,
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
    const institute_id = req.body.institute_id;

    // Validation
    if (!dept || !year || !semester || !institute_id) {
      return res
        .status(400)
        .send("Department, year, semester, and institute_id are required.");
    }

    // Find attendance by department and year and populate student and staff fields
    const AttendanceList = await Attendance.find({
      semester: semester,
      institute: institute_id,
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

// Get attendance by roll number
exports.getAttendanceByRollno = async (req, res) => {
  try {
    const rollno = req.params.rollno;
    const institute_id = req.body.institute_id;

    // Validation
    if (!rollno || !institute_id) {
      return res.status(400).send("Roll number and institute_id are required.");
    }

    const AttendanceData = await Attendance.findOne({
      rollno,
      institute: institute_id,
    })
      .populate("student", "name rollno department year")
      .populate("staff", "name year");

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
    const institute_id = req.body.institute_id;

    // Validation
    if (!date || !institute_id) {
      return res.status(400).send("Date and institute_id are required.");
    }

    // Find attendance by date
    const AttendanceList = await Attendance.find({
      institute: institute_id,
      "attendance.date": {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
    })
      .populate("student", "name rollno department year")
      .populate("staff", "name year");

    if (!AttendanceList || AttendanceList.length === 0) {
      return res.status(404).send("Attendance is not taken on this date.");
    }

    res.status(200).send(AttendanceList); // response
  } catch (error) {
    console.log("Attendance getting error: " + error.message);
    res.status(500).send("An error occurred while retrieving attendance.");
  }
};

