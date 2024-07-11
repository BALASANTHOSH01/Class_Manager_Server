const Institute = require("../models/institute.model.js");

// Update institute account
exports.updateInstitute = async (req, res) => {
    try {
        const {updates} = req.body;
        const institute = req.instituteId;
        
        // Update institute document
        const updatedInstitute = await Institute.findByIdAndUpdate(institute, updates, { new: true });

        if (!updatedInstitute) {
            return res.status(404).send("Institute not found.");
        };

        res.status(200).send(updatedInstitute); // Send updated institute data as response

    } catch (error) {
        console.error("Update institute error:", error.message);
        res.status(500).send("An error occurred while updating institute.");
    }
};

// Delete institute account
exports.deleteInstitute = async (req, res) => {
    try {
        const institute = req.instituteId;

        // Delete institute document
        const deletedInstitute = await Institute.findByIdAndDelete(institute);

        if (!deletedInstitute) {
            return res.status(404).send("Institute not found.");
        }

        res.status(200).send("Institute deleted successfully."); // Send success message

    } catch (error) {
        console.error("Delete institute error:", error.message);
        res.status(500).send("An error occurred while deleting institute.");
    }
};

// Get institute by name
exports.getInstituteByName = async (req, res) => {
    try {
        let name = req.params.name;
        console.log("college name"+name)
        if (!name) {
            return res.status(409).send("Name is required.");
        }
        
        
       // Create a regex pattern for partial matching
       const regex = new RegExp(name, 'i'); // 'i' for case-insensitive

       const instituteData = await Institute.find({ name: regex });
       if (!instituteData.length) {
           return res.status(404).send("Institute is not found.");
       }

        // Specify the data
        const data = {
            name: instituteData.name,
            unique_code: instituteData.unique_code,
            pincode: instituteData.pincode,
            college_code: instituteData.college_code
        };

        res.status(200).send(data);

    } catch (error) {
        console.error("Getting institute by name error:", error.message);
        res.status(500).send("An error occurred while retrieving the institute.");
    }
};

exports.getInstituteByCollegeCode = async(req,res)=>{
    const collegeCode = req.params.college_code;

    if(!collegeCode){
        res.status(409).send("College Code is required.");
    };

    const InstituteData = await Institute.findOne({college_code:collegeCode});
    if(!InstituteData){
        res.status(404).send("Institute is not found.");
    };

    res.send(InstituteData);
}