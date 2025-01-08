const {getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp} = require('../controllers/bootcamps.js')
const express=require('express')
const router=express.Router();
router.get('/',getBootcamps)
router.post('/',createBootcamp)
router.get('/:id',getBootcamp)
router.put('/:id',updateBootcamp)
router.delete('/:id',deleteBootcamp)
module.exports=router