const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const  Personnel=require('../models/personnel.model.js')


module.exports.signup=(req,res,next)=>{
	bcrypt.hash(req.body.password,10)
    .then(hash=>{
    	const personnel=new Personnel({
    		password:hash,
    		Matricule:req.body.Matricule,
    		email:req.body.email,
    		nom:req.body.nom,
    		prenom:req.body.prenom,
    		tel:req.body.tel,
    		startDate:req.body.startDate,
    		role:{
    			nomRole:req.body.nomRole,
    			startDate:req.body.startDate
    		}
    	})
    	personnel.save()
    	.then((personnel)=>{
            var token=jwt.sign({id:personnel._id},'secretkey',{expiresIn:86400})
            console.log(token)
            res.status(201).json({auth:true,token:token})
        })
    	.catch(error=>res.status(400).json({error:"pas crée"}))
    })
    .catch(error=>res.status(500).json({error:"pas crée"}))
}