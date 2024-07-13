const Student = require("../models/student.model.js");
const bcrypt = require("bcrypt");

//create many students [{},{}]
exports.createManyStudents = async (req, res) => {
  try {
    const institute = req.instituteId; // institute id
    const StudentList = req.body;

    if (!Array.isArray(StudentList) || StudentList.length === 0) {
      return res
        .status(400)
        .send("Input data should be a non-empty array of students.");
    }

    const emails = StudentList.map((student) => student.email);
    const existingStudents = await Student.find({
      email: { $in: emails },
      institute: institute,
    });
    const existingEmails = existingStudents.map((student) => student.email);

    // Add institute and filter existing students
    const newStudents = [];
    for (const student of StudentList) {
      if (!existingEmails.includes(student.email)) {
        student.institute = institute;
        newStudents.push(student);
      }
    }

    if (newStudents.length === 0) {
      return res.status(409).send("All students already exist.");
    }

    const createdStudents = await Student.insertMany(newStudents);

    const conflicts = StudentList.length - newStudents.length;

    res.status(201).send({
      created: createdStudents.length,
      conflicts: conflicts,
      message: `${createdStudents.length} students created, ${conflicts} already existed.`,
    });
  } catch (error) {
    console.log("Multiple Students creation error " + error.message);
    res.status(500).send("Server error.");
  }
};

// Get student by "rollno"
exports.getStudentByRollno = async (req, res) => {
  try {
    const {institute,rollno} = req.params; // institute id

    const StudentData = await Student.findOne({
      rollno: rollno,
      institute: institute,
    }); // find by rollno
    if (!StudentData) {
      return res.status(404).send("Student not exist.");
    }
    res.status(200).send(StudentData);
  } catch (error) {
    console.log("Student getting error " + error.message);
    res.status(500).send("Server error.");
  }
};

// Get students by "department" and "year"
exports.getStudentByDeptandYear = async (req, res) => {
  try {
    const institute = req.instituteId; // institute id
    const dept = req.params.department;
    const year = req.params.year;

    //Find by department and year
    const StudentData = await Student.find({
      department: dept,
      year: year,
      institute: institute,
    });
    if (!StudentData) {
      return res.status(404).send("Student not exist or Wrong credentials");
    }
    res.status(200).send(StudentData);
  } catch (error) {
    console.log("Student getting error " + error.message);
    res.status(500).send("Server error.");
  }
};

// Delete student from DB
exports.deleteStudent = async (req, res) => {
  try {
    const institute = req.instituteId; // institute id
    const rollno = req.params.rollno;

    //Find and delete the student
    const student = await Student.findOneAndDelete({
      rollno: rollno,
      institute: institute,
    });
    if (!student) {
      return res.status(404).send("Student Not found by this details");
    }
    res.status(200).send("Student deleted successfully");
  } catch (error) {
    console.log("Student deletion error " + error.message);
    res.status(500).send("Server error.");
  }
};

// Update student details
exports.updateStudent = async (req, res) => {
  try {
    const institute = req.instituteId; // institute id
    const rollno = req.params.rollno;
    const updatedData = req.body;

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    //Find and update the student
    const updatedStudent = await Student.findOneAndUpdate(
      { rollno: rollno, institute: institute },
      updatedData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).send("Student not found.");
    }

    res.status(200).send(updatedStudent);
  } catch (error) {
    console.log("Student updation error " + error.message);
    res.status(500).send("Server error.");
  }
};

// Update Many students details
exports.updateManyStudent = async (req, res) => {
  try {
    const institute = req.instituteId; // institute id
    const dataList = req.body;

    if (!Array.isArray(dataList) || !dataList) {
      return res.status(409).send("Updating data is not present.");
    }

    const result = {
      updatedData: [],
      errorData: [],
    };

    for (const data of dataList) {

      // check the student has the email 
      if (!data.email) {
        result.errorData.push({ error: 'Email is required', data });
        continue; // Skip this entry and continue with the next one
      }

      // Hash the password if it's changed
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      try {

        // Find student and update if present
        const studentData = await Student.findOneAndUpdate(
          { email: data.email, institute: institute },
          data,
          { new: true }
        );

        if (studentData) {
          result.updatedData.push(studentData);
        } else {
          result.errorData.push({ error: "Student not found", data });
        }

      } catch (error) {
        result.errorData.push({ error: error.message, data });
      }

    }

    res.status(200).send(result);
  } catch (error) {
    console.log("Student updation error " + error.message);
    res.status(500).send("updating many student error.");
  }
};
