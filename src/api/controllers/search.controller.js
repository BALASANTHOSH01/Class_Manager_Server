const Staff = require("../models/staff.model");
const Student = require("../models/student.model");
const Institute = require("../models/institute.model");

exports.searchInstitute = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(409).send("Query is required.");
        }

        const InstituteData = await Institute.find({ name: new RegExp(query, 'i') });
        res.status(200).send(InstituteData);

    } catch (error) {
        console.log("Getting institute error " + error.message);
        res.status(500).send("Server error.");
    }
}

exports.searchStudent = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(409).send("Query is required.");
        }

        const StudentData = await Student.find({ rollno: new RegExp(query, 'i') });
        res.status(200).send(StudentData);

    } catch (error) {
        console.log("Getting student error " + error.message);
        res.status(500).send("Server error.");
    }
}

exports.searchStaff = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(409).send("Query is required.");
        }

        const StaffData = await Staff.find({ name: new RegExp(query, 'i') });
        res.status(200).send(StaffData);

    } catch (error) {
        console.log("Getting staff error " + error.message);
        res.status(500).send("Server error.");
    }
}
