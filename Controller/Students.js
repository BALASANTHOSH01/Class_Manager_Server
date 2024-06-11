const Students = require("../Model/Students.js");

exports.getStudentByYear = async (req, res) => {
    const { year } = req.params;
    try {
        const data = await Students.getStudentByYear(year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students by year', error: error.message });
    }
};

exports.getStudentByDept = async (req, res) => {
    const { department } = req.params;
    try {
        const data = await Students.getStudentByDept(department);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students by department', error: error.message });
    }
}

exports.getStudentByName = async (req, res) => {
    // const { name } = req.params;
    try {
        const data = await Students.getStudentByName();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students by name', error: error.message });
    }
}

exports.getStudentByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const data = await Students.getStudentByEmail(email);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students by email', error: error.message });
    }
}
