const Bootcamp= require('../models/Bootcamp')

// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access Private

exports.createBootcamp=async(req,res,next)=>{
    try {
        const bootcamp=await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,
            data:bootcamp
    
        })
        
    } catch (error) {
        res.status(400).json({success:false})
        
    }
  
}
// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps= async(req,res,next)=>{
    try {
        const bootcamps= await Bootcamp.find();
        res.status(200).json({success:true,data:bootcamps})

        
    } catch (error) {
        res.status(400).json({success:false})
        
    }

    
}
// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamp
// @access Public
exports.getBootcamp=async(req,res,next)=>{
    try {
        const bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return res.status(400).json({success:false})
        }
        console.log(req.params.id)
        res.status(200).json({success:true,data:bootcamp})
         
        
    } catch (error) {
        res.status(400).json({success:false})
        
    }
}
// @desc   Update a bootcamp
// @route  PUT /api/v1/bootcamp
// @access Private

exports.updateBootcamp=async(req,res,next)=>{
    try {
        const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!bootcamp){
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:bootcamp})
        
    } catch (error) {
        return res.status(400).json({success:false})
        
    }
 
}
// @desc   Delete a bootcamp
// @route   /api/v1/bootcamp
// @access Private

exports.deleteBootcamp=async(req,res,next)=>{
    try {
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:{}})
        
    } catch (error) {
        return res.status(400).json({success:false})
        
    }
 
}