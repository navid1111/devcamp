const {getBootcamps, createBootcamp} = require('../controllers/bootcamps.js')
const express=require('express')
const router=express.Router();
router.get('/',getBootcamps)
router.post('/',createBootcamp)
module.exports=router