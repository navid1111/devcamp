const mongoose = require('mongoose')

const connectDB=async()=>{
    const conn= await mongoose.connect(process.env.MONGO_URI,{
        
    })

    console.log(`successful connection with ${conn.connection.host}`)
}
module.exports=connectDB