const Students = require("../Model/Students.js");


exports.getStudentByYear = async (req,res) =>{
    const {department,year}= req.params;
    try {
        const data = await Students.getStudentByYear(department,year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};

exports.getStudentByDept = async(req,res)=>{
    const {department}=req.params;
    try {
        const data = await Students.getStudentByDept(department);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
}