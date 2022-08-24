require("dotenv").config();
const nodemailer = require('nodemailer');
var fs = require('fs');
var jwt = require('jsonwebtoken');
const Paciente = require('../models/Paciente');
const { v4: uuidv4 } = require('uuid');

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
	  pontos = (peso - novopeso) * 5;
	  return pontos
	}
	/*updateAltura(altura){

		console.log(altura);
 		users.altura = 170;
 		users.save();
		
	}*/

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
		var token = req.headers['x-access-token']; 
	
		if (!token) 
			return res.status(401).send({ auth: false, message: 'Token não informado ou expirado.' }); 
		
		token = utils.decrypt(token);
		var data = token.split('&');
	
		const users = await Paciente.findAll({
			attributes: ['email', 'uuid'],
			where: {
			  uuid: data[1]
			}
		}); 
	
		if(Object.keys(users).length < 0) {
			return res.status(400).json({
				erro: true,
				mensagem: "Erro: Cadastro não encontrado!"
			})
		}
	
		var d_token = `${users[0].dataValues.email}&${users[0].dataValues.uuid}`;
	
		return (token === d_token);
	}

  }

  const utils = new Utils();
  
  module.exports = utils; 