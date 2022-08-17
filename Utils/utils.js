require("dotenv").config();
const nodemailer = require('nodemailer');

//Função para criar transportador 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

class Utils {
    constructor() {

     }
     //Função para calcular o IMC do paciente
    imc(peso, altura) {

        return peso/(altura*altura);
     }

    //Função quw envia um email para o usuário 
    sendEmail(userMail, content, subject){
        const mailOptions = {
            from: process.env.EMAIL,
            to: userMail,
            subject: subject,
            html: content,
          };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
     }

  }

  const utils = new Utils();
  
  module.exports = utils; 