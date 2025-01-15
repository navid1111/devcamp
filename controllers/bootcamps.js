const asyncHandler = require('../middleware/async');
const Bootcamp= require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const geocoder=require('../utils/nodeGeocoder')



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
        let query;
        let queryString=JSON.stringify(req.query);
        
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        console.log(queryString)
        query= Bootcamp.find(JSON.parse(queryString))
    
        const bootcamps= await query;
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
  

  
// @desc   Get bootcamp within a radius
// @route   /api/v1/bootcamp/radius/:zipcode/:distance/:unit
// @access Private
exports.getBootcampsInRadius=asyncHandler(async(req,res,next)=>{
    
    const {zipcode,distance}=req.params;

    // get lat/lng

    const loc=await geocoder.geocode(zipcode);
    const lat=loc[0].latitude;
    const lng=loc[0].longitude;

    // Calc radius using radians
    // Divide distance by the radius of earth 3,963 miles

    const radius = distance/3963;
// @doc:https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/?msockid=2a01ced96e576840203bddc46f8b69d1
    const bootcamps= await Bootcamp.find({
        location:{$geoWithin: { $centerSphere: [ [ lng,lat ], radius ] }}

    })
    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    })


})

