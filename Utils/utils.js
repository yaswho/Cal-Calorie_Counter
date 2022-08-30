require("dotenv").config();
const nodemailer = require('nodemailer');
var fs = require('fs');
var jwt = require('jsonwebtoken');
const Paciente = require('../models/Paciente');
const { v4: uuidv4 } = require('uuid');
const url = require('url');  

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
	//Função para calcular os pontos
	calcularPontos(peso, novopeso) {
		
	  pontos = (peso - novopeso) * 10;
	  return pontos
	}
	
	encrypt(data, timeInMinutes)
	{
		var privateKey  = fs.readFileSync(`${__dirname}/private/private.pem`, {encoding: 'utf8', flag:'r'});
		var encrypted = jwt.sign({ data }, {key: privateKey, passphrase: process.env.PASSPHRASE }, { 
			expiresIn: timeInMinutes*60, // tempo em segundos 
			algorithm:  "RS256" //SHA-256 hash signature
		}); 

	  	return encrypted;
	}

	decrypt(data)
	{
	  var publicKey  = fs.readFileSync(`${__dirname}/private/public.pem`, {encoding: 'utf8', flag:'r'});
	  var decoded = jwt.verify(data, publicKey, {algorithm: ["RS256"]});
	  return decoded.data; 
	}

	setCookie(res, name, data, timeInMinutes)
	{
		res.cookie(name, data, {
		  maxAge: timeInMinutes * 6000, // maxAge:0 => sessão
		  //secure: true,
		  httpOnly: true,
		  sameSite: 'lax'
	  });
	}

	hasCookie(req, name)
	{
		if(Object.keys(req.cookies)[name])
		{
			return true;
		} else return false;
	}

	deleteCookie(res, name)
	{
		res.clearCookie(name);
	}

	async generatePacientUUID()
	{
		var _uuid = uuidv4();

		const users = await Paciente.findAll({
			where: {
			  uuid: _uuid
			 }
		}); 
			
		if(Object.keys(users).length > 0) return this.generatePacientUUID();

		return _uuid;
	}

	getUUIDFromToken(token)
	{
		var dec = utils.decrypt(token);
		return dec.split('&')[1];
	}
	
	async verifyJWT(req, res, next) { 
		var authHeader = req.headers.authorization;

		if (!authHeader) 
		{
			if(Object.keys(req.cookies).includes("token")) 
			{
				authHeader = `Auth ${req.cookies.token}`;
			} else return res.status(401).send({ auth: false, message: 'Token não informado ou expirado.' });
		}			 

		const _token = authHeader.split(' ')[1];
		const token = utils.decrypt(_token);

		if (!token) {
			return res.sendStatus(403);
		}

		const users = await Paciente.findAll({
			where: {
			  uuid: token.split('&')[1]
			 }
			}); 
		
		if(Object.keys(users).length > 0) {
			req.user = users[0];
			next();
		} else res.sendStatus(401);
	}

	
	createFeedback(title, feedback_title, feedback, color, img)
	{
		return this.encrypt(JSON.stringify({
			title: title,
			feedback_title: feedback_title,
			feedback: feedback,
			color: color,
			img: img
		}), 60);
	}

	createURLFeedback(title, feedback_title, feedback, color, img)
	{
		const json = this.createFeedback(title, feedback_title, feedback, color, img);
		const str = url.format({
			pathname: "../site/feedback",
			query: {
				r: json
			}
		});
		
		return str;
	}

  }

  const utils = new Utils();
  
  module.exports = utils; 