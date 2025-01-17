const express = require('express');
const { register,login, getMe } = require('../controllers/auth');
const{ protect } = require('../middleware/auth');
const router = express.Router();


router.route('/register').post(register);
router.post('/login',login)
router.get('/me',protect,getMe)

module.exports = router;
