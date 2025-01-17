const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');



// @desc Register User
// @route POST/api/v1/auth/register
// @public
exports.register = asyncHandler(async (req, res, next) => {
    const {name,email,password,role}=req.body
    const user= await User.create({
        name,
        email,
        password,
        role
    })
    // create token
    sendTokenResponse(user,200,res)
  });

// @desc LogIn User
// @route POST/api/v1/auth/login
// @public
exports.login = asyncHandler(async (req, res, next) => {
    const {email,password}=req.body

    // validate email and password
    if(!email || !password){
        return next(new errorResponse('Please provide an Email and a password',400))
    }
    const user= await User.findOne({email}).select('+password'); 
    console.log(user);
    if(!user){
        return next(new errorResponse('Invalid Credentials'),401)

    }
    // check if the password matches
    const isMatched= await user.matchPassword(password);
    if(!isMatched){
        return next(new errorResponse('Invalid Credentials'),401)
 
    }

    sendTokenResponse(user,200,res)
 
  });


// Get token from model,create cookie and send response

const sendTokenResponse=(user,statusCode,res)=>{
    const token=user.getSignedJwtToken();

    const options={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE * 24*60*60*1000),
        httpOnly:true
    };

    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res
      .status(statusCode)
      .cookie('token',token,options)
      .json({
        success:true,
        token
      })

}

// @desc Get Current logged in User
// @route POST/api/v1/auth/me
// @private
exports.getMe= asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
})