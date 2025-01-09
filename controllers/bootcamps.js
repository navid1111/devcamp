const asyncHandler = require('../middleware/async');
const Bootcamp= require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');



// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access Private
exports.createBootcamp=asyncHandler(async(req,res,next)=>{
    
        const bootcamp=await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,
            data:bootcamp
    
        })
    })
   
  
// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps= asyncHandler(async(req,res,next)=>{
    
        const bootcamps= await Bootcamp.find();
        res.status(200).json({success:true,data:bootcamps,count:bootcamps.length})

    })
        
   

    
// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamp
// @access Public
exports.getBootcamp=asyncHandler(async(req,res,next)=>{
    
        const bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new errorResponse(`response not found for id ${req.params.id}`),404);
        }
        console.log(req.params.id)
        res.status(200).json({success:true,data:bootcamp})
    })
         
        
   
  

// @desc   Update a bootcamp
// @route  PUT /api/v1/bootcamp
// @access Private
exports.updateBootcamp=asyncHandler(async(req,res,next)=>{
    
        const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!bootcamp){
            return next(new errorResponse(`response not found for id ${req.params.id}`),404);
        }
        res.status(200).json({success:true,data:bootcamp})
    })
        
  
 

// @desc   Delete a bootcamp
// @route   /api/v1/bootcamp
// @access Private
exports.deleteBootcamp=asyncHandler(async(req,res,next)=>{
    
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return next(new errorResponse(`response not found for id ${req.params.id}`),404);
        }
        res.status(200).json({success:true,data:{}})
    })
        
  
 