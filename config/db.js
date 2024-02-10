const mongoose = require('mongoose')

async function connectDB(){
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/Stroybooks')
        console.log(`MongoDB connected : ${conn.connection.host}`)

    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB