var nodemailer = require('nodemailer');


module.exports=(req,res,next)=>{
	const aleatoire=(N)=> {
return (Math.floor((N)*Math.random()+1));
}   
    let code=aleatoire(100000);
	const transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'yourEmail@gmail.com',
	    pass: 'password'
	  }
	});

	const mailOptions = {
	  from: 'yourEmail@gmail.com',
	  to: 'destinationEmail@gmail.com',
	  subject: 'Sending Email using Node.js',
	  text:`code is :${code}`
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	    res.status(400).json({error})
	  } else {
	    console.log('Email sent: ' + info.response);
	    res.status(200).json({message:'mail envoyé',code:code})
	  }
	});
}