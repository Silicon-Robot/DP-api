const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const  Personnel=require('../models/personnel.model.js')

module.exports.createPersonnel=(req,res,next)=>{
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
    	.then(()=>res.status(201).json({message:'utilisateur crée'}))
    	.catch(error=>res.status(400).json({error:"utilisateur pas crée"}))
    })
    .catch(error=>res.status(500).json({error:"erreur serveur"}))
}

exports.getAllPersonnel=(req, res, next) => {
	// console.log(req.headers)
	Personnel.find()
	.then(personnel=>res.status(201).json(personnel))
	.catch(error=>res.status(404).json({error}))

}
exports.deletePersonnel=(req,res,next)=>{
	Personnel.deleteOne({_id:req.params.id})
	.then(()=>res.status(200).json({message:'supperssion reussie'}))
	.catch(error=>res.status(404).json({error}))
}
exports.modifyPersonnel=(req,res,next)=>{
	Personnel.updateOne({_id:req.params.id},{...req.body,_id:req.params.id})
	.then(()=>res.status(201).json({message:'article a bien été modifié'}))
	.catch(error=>res.status(400).json({error}))
}