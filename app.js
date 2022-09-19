require("dotenv").config();

//Configurações 
const express = require('express');
const app = express();
const cors = require('cors');
const Paciente = require('./models/Paciente');
const Keys = require('./models/Keys');
const Utils = require('./Utils/utils');
const api = require('./Routes/api');
const site = require('./Routes/site');
const nodemailer = require('nodemailer');
const Chronos = require('./Utils/Chronos.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');  
const helmet = require("helmet");
const utils = require("./Utils/utils");
const path = require('path');
const inquirer = require('inquirer');
const onCommand = require('./Utils/commands')
const bcrypt = require('bcrypt');

// app.use(fileUpload({
//     createParentPath: true
// }));

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, 'public')));
//app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'ejs');
app.set('views', './view')

//Rotas 
app.use('/api', api)
app.use('/site', site)


Keys.findAll({
	where: {
	  namespace: 'HARDWARE'
	 }
	}).then((keys) => {
		if(Object.keys(keys).length < 1)
		{
			console.log("Aviso: Não foi encontrado a chave de funcionamento do hardware.")
			inquirer
				.prompt([
					{
					type: 'password',
					message: 'Entre com uma senha para a geração da chave. ',
					name: 'key',
					mask: '*',
					validate: requireLetterAndNumber,
					},
				]).then((answers) => {
					var salt = bcrypt.genSaltSync(13);
					const psw = bcrypt.hashSync(answers.key, salt);
					const token = utils.encrypt(psw, -1);

					Keys.create({ namespace: 'HARDWARE', key: token })
						.then(() => {
							utils.sendEmail(
								process.env.EMAIL,
								utils.readEmail('key', {link: `http://localhost:8080/public/imgs/sonhodevalsa.jpg`, key: `${token}`}),
								`Chave de Acesso do Hardware`
							)
							process.stdin.resume()
							startServer();
						})
				});
		} else startServer();		
	});

function startServer()
{
	process.stdin.on('data', function (text) 
	{
		text = text.toString();
		text = text.split(' ')
		var command = text[0];
		var args = text.filter((value, i)=> {
			if(i > 0) return value
		})
		onCommand(command, args)
	});

	//Direcionando para o Frontend 
	app.get("/", async(req, res)=> {
		res.redirect('/site');
	});

	//Indicando servidor rodando 
	app.listen(process.env.PORT, () => {
		Chronos.start();
		Chronos.load();
		console.log(`Servidor iniciado em http://localhost:${process.env.PORT}/`);
	});
}

const requireLetterAndNumber = (value) => {
	if (/\w/.test(value) && /\d/.test(value)) {
		return true;
	}
	
	return 'Precisa de ao menos uma letra e um numero';
};