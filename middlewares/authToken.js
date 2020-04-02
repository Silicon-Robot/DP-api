const jwt=require('jsonwebtoken');


module.exports=(req,res,next)=>{

	try{
		const token=req.headers.token;
		console.log('token:',token)
		const decodedToken=jwt.verify(token,'secretkey');
          console.log(decodedToken)
		const userId=decodedToken.id;
        console.log(userId)
		if(req.body.userId && req.body.userId!==userId){
			throw 'invalid user id'
			res.status(404).json({error:'inavlid user id'})
		}else{
			next()
		}
	}catch{
      res.status(401).json({error:'invalid request'})
	}
}