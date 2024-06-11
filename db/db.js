const mongoose = require("mongoose");

async function main(){
    await mongoose.connect(process.env.DB_URI);
}
main().catch((err)=>console.log(err));

module.exports = main;