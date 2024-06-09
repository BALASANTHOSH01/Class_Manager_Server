const db = require("./db.js");

class Students {
    static async getStudentByYear(dept,year){
        let sql = `SELECT * FROM ${dept}_stu_details WHERE year = ?`;
        const [data] = await db.query(sql,year);
        return data;
    }

    static async getStudentByDept(dept){
        let sql = `SELECT * FROM ${dept}_stu_details`;
        const [data] = await db.query(sql);
        return data;
    }
}

module.exports = Students;