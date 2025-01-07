const express = require('express')
const dotenv=require('dotenv')
const bootcamps=require('./routes/bootcamps')
dotenv.config()
const app = express()
const logger=(req,res,next)=>{
  req.hello='Hello world';
  console.log('Middleware ran');
  next();
}
app.use(logger)
app.use('/api/v1/bootcamps',bootcamps)

const port = process.env.PORT




app.listen(port, () => console.log(`Example app listening on port ${port}!`))