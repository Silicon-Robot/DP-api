const express=require('express');
const router=express.Router();
const Personnel=require('../models/personnel.model');
const personnel=require('../controller/personnel.js');
const authToken=require('../middlewares/authToken.js')

router.get('/',authToken,personnel.getAllPersonnel);
router.post('/',authToken,personnel.createPersonnel)
router.delete('/:id',authToken,personnel.deletePersonnel)
router.put('/:id',authToken,personnel.modifyPersonnel)
module.exports=router;