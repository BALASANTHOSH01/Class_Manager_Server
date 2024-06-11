const mongoose = require("mongoose");

async function main(){
    mongoose.connect(process.env.DB_URI);
}
main().catch((err)=>console.log(err));