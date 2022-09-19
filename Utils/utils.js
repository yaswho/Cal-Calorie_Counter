require("dotenv").config();
const nodemailer = require('nodemailer');
var fs = require('fs');
var jwt = require('jsonwebtoken');
const Paciente = require('../models/Paciente');
const { v4: uuidv4 } = require('uuid');
const url = require('url');  
const path = require('path');

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
		this.IMC = {
			ABAIXO_DO_PESO: 1,
			PESO_NORMAL: 2,
			EXCESSO_DE_PESO: 3,
			OBESIDADE: 4,
			OBESIDADE_EXCESSIVA: 5
		}

		this.getWeight = function(imc) {
			if(imc === this.IMC.ABAIXO_DO_PESO) {
				return 8;
			} else if(imc === this.IMC.PESO_NORMAL) {
				return 5;
			} else if(imc === this.IMC.EXCESSO_DE_PESO) {
				return 6;
			} else if(imc === this.IMC.OBESIDADE) {
				return 7;
			} else if(imc === this.IMC.OBESIDADE_EXCESSIVA) {
				return 8;
			} else return 1;
		}
	 }
	 //Função para calcular o IMC do paciente
	imc(peso, altura) {
		if(peso === 0) return 0;
		return peso/(altura*altura);
	 }

	//Função quw envia um email para o usuário 
	sendEmail(userMail, content, subject){
		const mailOptions = {
			from: process.env.EMAIL,
			to: userMail,
			subject: subject,
			html: content,
			attachments: [{
				filename: 'apple1.png',
				path: `${path.join(__dirname, '../')}/public/imgs/apple1.png`,
				cid: 'logo'
			}],
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
	calcularPontos(user, peso, peso_anterior) {
		const imc = this.getIMC(this.imc(peso, user.altura));
		const imc_anterior = this.getIMC(this.imc(peso_anterior, user.altura));
		var weight = -1;

		/*
			|weight| = magnitude 
			sinal = controla se add ou rem

			ex: final - inicial, IMC = peso normal

			caso 1:
			final = 50
			inicial = 60

			50 - 60 = -10

			(começa)
			weight = -1 -> peso normal ( x5 ) => weight = -5

			-10 * -5 = 50 pontos

			caso 2:
			final = 70
			inicial = 50

			70 - 50 = 20

			weight = -1 -> peso normal ( x5 ) => weight = -5

			20 * -5 = -100 pontos


		*/

		if(imc === imc_anterior) // IMC ficou igual
		{
			weight *= this.getWeight(imc);
		} else if(imc > imc_anterior) { // IMC aumentou
			if(imc_anterior === this.IMC.ABAIXO_DO_PESO)
			{
				weight *= this.getWeight(imc_anterior);
			} else weight *= this.getWeight(imc);
		} else { // imc < imc_anterior || IMC diminuiu
			if(imc === this.IMC.ABAIXO_DO_PESO)
			{
				weight *= this.getWeight(imc);
			} else weight *= this.getWeight(imc_anterior);
		}

		console.log("weight")
		console.log(weight)
		

		console.log("peso")
		console.log(peso)
		console.log("peso ant")
		console.log(peso_anterior)
		console.log("calc")
		console.log((peso - peso_anterior)*weight)
	  	return (peso - peso_anterior)*weight;	
	}
	
	
	encrypt(data, timeInMinutes)
	{
		var privateKey  = fs.readFileSync(`${__dirname}/private/private.pem`, {encoding: 'utf8', flag:'r'});
		var encrypted;

		if(timeInMinutes > 0)
		{
			encrypted = jwt.sign({ data }, {key: privateKey, passphrase: process.env.PASSPHRASE }, { 
				expiresIn: timeInMinutes*60, // tempo em segundos 
				algorithm:  "RS256" //SHA-256 hash signature
			}); 	
		} else {
			encrypted = jwt.sign({ data }, {key: privateKey, passphrase: process.env.PASSPHRASE }, { 
				algorithm:  "RS256" //SHA-256 hash signature
			}); 
		}

	  	return encrypted;
	}

	decrypt(data)
	{
	  var publicKey = fs.readFileSync(`${__dirname}/private/public.pem`, {encoding: 'utf8', flag:'r'});
	  var decoded = jwt.verify(data, publicKey, {algorithm: ["RS256"]});
	  return decoded.data; 
	}

	setCookie(res, name, data, timeInMinutes)
	{
		res.cookie(name, data, {
		  maxAge: timeInMinutes * 60000, // maxAge:0 => sessão
		  //secure: true,
		  httpOnly: true,
		  sameSite: 'lax'
	  });
	}

	hasCookie(req, name)
	{
		if(Object.keys(req.cookies).includes(name))
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
	
	async verifyJWT(req, res, next) 
	{ 
		console.log("Verificando")
		if(req.cookies)
		{
			if(Object.keys(req.cookies).includes("token"))
			{
				console.log("tem token")
				const token = utils.decrypt(req.cookies.token)
				console.log("decriptou")
				const users = await Paciente.findAll({
					where: {
					  uuid: token.split('&')[1]
					 }
					}); 
				console.log(`procurando um tal de ${token.split('&')[1]}`)
				if(Object.keys(users).length > 0) {
					req.user = users[0];
					if(req.user.peso_anterior !== '' && req.user.peso_anterior !== 'undefined')
					{
						req.user.peso_anterior = JSON.parse(req.user.peso_anterior);
					}
					if(req.user.altura_anterior !== '' && req.user.altura_anterior !== 'undefined')
					{
						req.user.altura_anterior = JSON.parse(req.user.altura_anterior);
					}
					next();
				} //else res.redirect("../site/login")
				console.log("amada?")
			} else if(Object.keys(req.cookies).includes("refresh") && req.cookies.refresh) {
				console.log("Num tem token")
				console.log(`procurando um refresh token assim ${req.cookies.refresh}`)
				const users = await Paciente.findAll({
					attributes: ['email', 'uuid', 'expiresIn'],
					where: {
						refreshToken: req.cookies.refresh
					}
				}); 
				console.log("vendo se tem")
				if(Object.keys(users).length > 0)
				{
					const user = users[0].dataValues;
					console.log("achou")
					if(user.expiresIn >= Date.now())
					{
						console.log("renovou")
						utils.grantToken(res, user);
						await utils.grantRefreshToken(res, user);
						// await utils.verifyJWT(req, res, next);
						next();
					} else res.redirect("../site/login")

				} else res.redirect("../site/login")
			}
		}
	}

	async hasUUID(token) 
	{
		const tk = utils.decrypt(token);

		if (!tk) {
			return false;
		}

		const users = await Paciente.findAll({
			where: {
			  uuid: tk.split('&')[1]
			 }
			}); 
		
		if(Object.keys(users).length > 0) {
			return true;
		} else return false;
	}
	
	createFeedback(title, feedback_title, feedback, color, img, isOff)
	{
		return this.encrypt(JSON.stringify({
			title: title,
			feedback_title: feedback_title,
			feedback: feedback,
			color: color,
			img: img,
			isOff: isOff
		}), 60);
	}

	createURLFeedback(title, feedback_title, feedback, color, img, isOff)
	{
		const json = this.createFeedback(title, feedback_title, feedback, color, img, isOff);
		const str = url.format({
			pathname: "../site/feedback",
			query: {
				r: json
			}
		});
		
		return str;
	}

	//pegar o último
	getLast(anterior_lista, std)
	{	
		return (anterior_lista.length > 0) ? anterior_lista[anterior_lista.length - 1] : std;
	}

	prepareChart(user)
	{
		var lista = user.peso_anterior;

		var pesos = []
		var datas = []

		for(var obj in lista)
		{
			pesos.push(lista[obj].peso)
			datas.push(lista[obj].data)
		}

		return {pesos, datas}
	}

	dataSplit(data)
	{
		var splitted = data.split('/');

		return { day: parseInt(splitted[0]), month: parseInt(splitted[1]), year: parseInt(splitted[2]) }
	}

	normalize(date)
	{
		var data = this.dataSplit(date);

		var n;

		switch(data.month) {
			case 1:
				var base = 0.5;
				n = base + data.day/31;
				break;
			case 2:
				var base = 1.5;
				var days = (bissex(date.year)) ? 29 : 28;
				n = base + data.day/days;
				break;
			case 3:
				var base = 2.5;
				n = base + data.day/31;;
				break;
			case 4:
				var base = 3.5;
				n = base + data.day/30;
				break;
			case 5:
				var base = 4.5;
				n = base + data.day/31;
				break;
			case 6:
				var base = 5.5;
				n = base + data.day/30;
				break;
			case 7:
				var base = 6.5;
				n = base + data.day/31;
				break;
			case 8:
				var base = 7.5;
				n = base + data.day/31;
				break;
			case 9:
				var base = 8.5;
				n = base + data.day/30;
				break;
			case 10:
				var base = 9.5;
				n = base + data.day/31;
				break;
			case 11:
				var base = 10.5;
				n = base + data.day/30;
				break;
			case 12:
				var base = 11.5;
				n = base + data.day/31;
				break;
			default:
				var base = 0;
				n = base + data.day/31;
				break;
		}

		return n;
	}

	datalize(user)
	{
		var pesos = user.peso_anterior;
		var data = [];

		for(var i = 0; i < pesos.length; i++)
		{
			var x = this.normalize(pesos[i].data);
			data.push({x: x, y: pesos[i].peso});
		}

		data.push({x: this.normalize(this.formatDate(new Date())), y: user.peso })

		return data;
	}
	
	getIMC(imc)
	{
		// ABAIXO DO PESO
		if(imc < 18.5)
		{
			return this.IMC.ABAIXO_DO_PESO;
			// NORMAL
		} else if(imc >= 18.5 && imc <= 24.9) {
			return this.IMC.PESO_NORMAL; 
			// SOBREPESO
		} else if(imc >= 25 && imc <= 29.9) {
			return this.IMC.EXCESSO_DE_PESO;
			// OBESIDADE
		} else if(imc >= 30 && imc < 35) {
			return this.IMC.OBESIDADE;
			// OBESIDADE EXTREMA
		} else {
			return this.IMC.OBESIDADE_EXCESSIVA;
		}
	}

	async canRedirect(req)
	{
		var t = true;

		if(req.cookies)
		{
			if(req.cookies.token)
			{
				var has = await utils.hasUUID(req.cookies.token)
				if(has)
				{
					t = false;
				}
			}
		}

		return t;
	}

	formatDate(inputDate) {
		let date, month, year;
	  
		date = inputDate.getDate();
		month = inputDate.getMonth() + 1;
		year = inputDate.getFullYear();
	  
		  date = date
			  .toString()
			  .padStart(2, '0');
	  
		  month = month
			  .toString()
			  .padStart(2, '0');
	  
		return `${date}/${month}/${year}`;
	  }

	  grantToken(res, user)
	  {
		const token = utils.encrypt(`${user.email}&${user.uuid}`, 20);
		utils.setCookie(res, "token", token, 20);
	  }

	  async grantRefreshToken(res, user)
	  {
		var date = Date.now();
		var expires = date + 3600000*24*3;
		var privateKey = await fs.promises.readFile(`${__dirname}/private/privateR.pem`, 'utf8', (err) => {
			if(err) console.log(err)
		});
		const dt = `${user.email}&${user.uuid}&${date}`;

		const token = jwt.sign({ dt }, {key: privateKey, passphrase: process.env.REFRESH_PASSPHRASE }, { 
			expiresIn: 259200, // tempo em segundos 
			algorithm:  "RS256" //SHA-256 hash signature
		});

		utils.setCookie(res, "refresh", token, 4320)

		await Paciente.update({ refreshToken: token.toString(), expiresIn: expires }, {
			where: {
				uuid: user.uuid
			}
		});

		return { refreshToken: token, date: date, expiresIn: expires }
	  }

	  readEmail(name, replaces)
	  {
		var email  = fs.readFileSync(`${path.join(__dirname, '../')}/public/emails/${name}.html`, {encoding: 'utf8', flag:'r'});

		for(var k = 0; k < Object.keys(replaces).length; k++)
		{
			let search = Object.keys(replaces)[k];

			if(!search.startsWith("{{")) search = "{{" + search;
			if(!search.endsWith("}}")) search = search + "}}";

			const searchRegExp = new RegExp(search, 'g');
			const replaceWith = replaces[Object.keys(replaces)[k]];

			email = email.replace(searchRegExp, replaceWith);
		}

		email = email.replace(new RegExp("{{(.+)*}}", 'g'), "");

		return email;
	  }

	  randomString(length) {
			var result           = '';
			var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var charactersLength = characters.length;
			for ( var i = 0; i < length; i++ ) {
				result += characters.charAt(Math.floor(Math.random() * 
			charactersLength));
			}
			return result;
		}

}
//cortou tudo kkk
 
function bissex(year)
{
	return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}

const utils = new Utils();

module.exports = utils; 