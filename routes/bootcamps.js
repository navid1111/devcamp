const {getBootcamps} = require('../controllers/bootcamps.js')
const express=require('express')
const router=express.Router();
router.get('/',getBootcamps)
module.exports=router