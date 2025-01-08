const {getBootcamps, createBootcamp, getBootcamp} = require('../controllers/bootcamps.js')
const express=require('express')
const router=express.Router();
router.get('/',getBootcamps)
router.post('/',createBootcamp)
router.get('/:id',getBootcamp)
module.exports=router