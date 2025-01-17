const {getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp,getBootcampsInRadius, addUserToBootcamp} = require('../controllers/bootcamps.js')
const express=require('express')
const router=express.Router();
const {protect,authorize, authorizeBootcampRole}=require('../middleware/auth.js')

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/')
    .get(getBootcamps)
    .post(protect,authorize('publisher','admin'),createBootcamp)

router.route('/:id')
    .get(getBootcamp)
    .put(protect,authorizeBootcampRole('update'),updateBootcamp)
    .delete(protect,authorize('publisher','admin'),deleteBootcamp)
   
router.post('/:id/assign',protect,authorizeBootcampRole('roleManage'),addUserToBootcamp)    

module.exports=router