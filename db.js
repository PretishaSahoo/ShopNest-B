const mongoose = require("mongoose")

const connectToMongo = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Coonnected to Database")
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectToMongo;