const Institute = require("../models/institute.model.js");

// Update institute account
exports.updateInstitute = async (req, res) => {
    try {
        const {updates,instituteId} = req.body;
        
        // Update institute document
        const updatedInstitute = await Institute.findByIdAndUpdate(instituteId, updates, { new: true });

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
        const {instituteId} = req.body;

        // Delete institute document
        const deletedInstitute = await Institute.findByIdAndDelete(instituteId);

        if (!deletedInstitute) {
            return res.status(404).send("Institute not found.");
        }

        res.status(200).send("Institute deleted successfully."); // Send success message

    } catch (error) {
        console.error("Delete institute error:", error.message);
        res.status(500).send("An error occurred while deleting institute.");
    }
};
