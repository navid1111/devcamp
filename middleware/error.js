const errorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error={...err}
  error.message=err.message
  console.log(err.name)
  // Log to console for dev
 


// Mongoose bad objectId
if(err.name==='CastError'){
  console.log("yes")

  const message=`response not found for id ${error.value}`
  console.log(message)
  error=new errorResponse(message,404)
  console.log(error.statusCode)
}
if(err.code===11000){
  const message='duplicate field value entered'
  error=new errorResponse(message,400)
}
if(err.name==='ValidationError'){
  console.log("yes");
  console.log(Object.values(error.errors));

  const message=Object.values(error.errors).map(function(value){return value.message});
  console.log(message);
  error=new errorResponse(message,404);
  console.log(error.statusCode);
}


  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;