const Student = require("../models/student.model.js");
const bcrypt = require("bcrypt");

// Create new student
exports.createStudent = async (req,res)=>{
    try {
        const {name,rollno,email,password,department,year,section,totalPresent,totalAbsent,phoneNumber,parentNumber,batch} = req.body;

        //Check if student exist
        const isExist = await Student.findOne({email:email});
        if(isExist){
            return res.status(409).send("User already exist.");
        }

        // Create student
        const StudentData = await Student.create({name,rollno,email,password,department,year,section,totalPresent,totalAbsent,phoneNumber,parentNumber,batch});

        res.status(201).send(StudentData);

    } catch (error) {
        console.log("Student creation error "+error.message);
    }
};

// Get student by "rollno"
exports.getStudentByRollno = async (req,res)=>{
    try {
        const rollno = req.params.rollno;
        const StudentData = await Student.findOne({rollno:rollno}); // find by rollno
        if(!StudentData){
            return res.status(404).send("Student not exist.");
        }
        res.status(200).send(StudentData);

    } catch (error) {
        console.log("Student getting error "+error.message);
    }
};

// Get students by "department" and "year"
exports.getStudentByDeptandYear =async(req,res)=>{
    try {
        const dept = req.params.department;
        const year = req.params.year;

        //Find by department and year
        const StudentData = await Student.find({department:dept,year:year});
        if(!StudentData){
            return res.status(404).send("Student not exist or Wrong credentials");
        }
        res.status(200).send(StudentData);

    } catch (error) {
        console.log("Student getting error "+error.message);
    }
};

// Delete student from DB
exports.deleteStudent = async (req,res)=>{
    try {
        const rollno = req.params.rollno;

        //Find and delete the student
        const student = await Student.findOneAndDelete({rollno:rollno})
        if(!student){
            return res.status(404).send("Student Not found by this details");
        }
        res.status(200).send("Student deleted successfully");
    } catch (error) {
        console.log("Student deletion error "+error.message);
    }
};

// Update student details
exports.updateStudent = async (req,res)=>{
    try {
        const rollno = req.params.rollno;
        const updatedData = req.body;

        if(updatedData.password){
            updatedData.password = await bcrypt.hash(updatedData.password , 10);
        }
        //Find and update the student
        const updatedStudent = await Student.findOneAndUpdate(
            { rollno },
            updatedData,
            { new: true }
        );
        
        if (!updatedStudent) {
            return res.status(404).send("Student not found.");
        }

        res.status(200).send(updatedStudent);
        
    } catch (error) {
        console.log("Student updation error "+error.message);
    }
};