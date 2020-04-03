const nodemailer = require('nodemailer');


const sendMail = (req, res, next) => {
  const aleatoire = (N) => {
    return (Math.floor((N) * Math.random() + 1));
  }
  let code = aleatoire(100000);
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
    subject: 'Comfirmation Code - Reset Password',
    html: `<div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;align-items: center;justify-content: center;">
            <h1 style="font-weight: 300;">Comfirmation Code</h1>
            <span><b>${code}</b></span>
          </div>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).json({ error: error })
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: code })
    }
  });
}




// module.exports = sendMail