const asyncHandler = require('../middleware/async');
const Bootcamp= require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const geocoder=require('../utils/nodeGeocoder')
const User= require('../models/User');


// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access Private
exports.createBootcamp=asyncHandler(async(req,res,next)=>{
        // Add User to req.body
        req.body.user=req.user.id;
        const bootcampData = {
            ...req.body,
            owner: req.user.id,
            userRoles: [
              {
                user: req.user.id,
                role: 'owner',
              
              },
            ],
            permissions: {
                roleManage:['owner'],
                update: ['owner'],
                delete: ['owner'],
              },
          };

        
    
        const bootcamp=await Bootcamp.create(bootcampData);
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

// @desc Post adds an user in his turf with assigning a role
// @route POST/api/v1/bootcamp/assign
// @private
exports.addUserToBootcamp = asyncHandler(async (req, res, next) => {
    const { userId, role } = req.body;
  
    // Input validation
    if (!userId || !role) {
      return next(new errorResponse('Please provide both userId and role', 400));
    }

    // Validate role is either 'editor' or 'owner'
    if (!['editor', 'owner'].includes(role)) {
      return next(new errorResponse('Role must be either editor or owner', 400));
    }

    try {
        // First check if both user and bootcamp exist
        const [userToAdd, bootcamp] = await Promise.all([
            User.findById(userId),
            Bootcamp.findById(req.params.id)
        ]);

        if (!userToAdd) {
            return next(new errorResponse(`User with ID ${userId} was not found`, 404));
        }

        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp with ID ${req.params.id} was not found`, 404));
        }

        // Check for existing role
        const existingRole = bootcamp.userRoles.find(
            userRole => userRole.user.toString() === userId.toString()
        );

        if (existingRole) {
            return next(
                new errorResponse(
                    `User with ID ${userId} is already assigned to this bootcamp with role: ${existingRole.role}`,
                    400
                )
            );
        }

        // Instead of using save(), use findByIdAndUpdate
        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    userRoles: { user: userId, role: role }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: updatedBootcamp.userRoles
        });

    } catch (error) {
        console.error('Update Error:', error);
        
        if (error.name === 'ValidationError') {
            return next(new errorResponse(`Validation Error: ${error.message}`, 400));
        }

        return next(new errorResponse('Error updating bootcamp user roles', 500));
    }
});