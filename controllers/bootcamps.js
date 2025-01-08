const Bootcamp= require('../models/Bootcamp')

// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access Private

exports.createBootcamp=async(req,res,next)=>{
    const bootcamp=await Bootcamp.create(req.body);
    res.status(201).json({
        success:true,
        data:bootcamp

    })
}
// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps=(req,res,next)=>{
    res.status(200).json({success:true,msg:'Show all bootcamps',hello:req.hello})
}