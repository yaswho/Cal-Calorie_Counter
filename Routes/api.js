require("dotenv").config();
const express = require('express');
const router = express.Router();
const Chronos = require('./../Utils/Chronos');
const utils = require('./../Utils/utils');
const Paciente = require('../models/Paciente');
const bcrypt = require('bcrypt');

const pontos = 0;
const novopeso = 0;

//Função para registrar o paciente
router.post("/registrarPaciente", async(req, res)=> {
   
	const users = await Paciente.findAll({
		where: {
		  email: req.body.email
		 }
		}); 
		
	if(Object.keys(users).length > 0) {
		res.render('feedback', {
			title: "Cal - Feedback",
			feedback_title: "Erro ao cadastrar",
			feedback: "Erro ao cadastrar.",
			color: "error-1",
			img: "error.png"
		});
	}

	if(!Chronos.isFree(req.body.email))
	{
		res.render('feedback', {
			title: "Cal - Feedback",
			feedback_title: "Erro ao cadastrar",
			feedback: `O email de confirmação já foi enviado para este o endereço ${req.body.email}.`,
			color: "error-1",
			img: "error.png"
		});
		return res.status(400).json({
			erro: true,
			mensagem: `Erro: Já enviamos o email de confirmação para o endereço ${req.body.email}.`
		})
	}
	
	var uuid = Chronos.checkEmail(req.body.email, req.body);

	utils.sendEmail(
		req.body.email,
		`<div style="padding: 5px; background-color: rgb(231, 231, 231); margin: 0px;">

		<div style="padding-left: 20px;">
		<h1 style="text-align: center; background-color: rgb(0, 128, 96); padding-top: 10px; padding-bottom: 10px;">Cadastro na Calorie Counter</h1></br>
			<p>Você iniciou o cadastro na Calorie Counter, para terminar, <a href="http://localhost:${process.env.PORT}/site/registro/${utils.encrypt(uuid, 60*24)}">clique aqui</a>.</p>
			<p>Obrigada pela preferência!</p></br></br>
		</div>
			
		</div>`,
		"Confirme seu cadastro."
	)

	res.render('feedback', {
		title: "Cal - Feedback",
		feedback_title: "Sucesso!",
		feedback: "Siga para seu email para terminar o seu registro.",
		color: "success-1",
		img: "success.jpg"
	});

});


//Função para inserir novos valores de altura e peso 
/*router.get("/update", async(req, res)=> {
		
	 const users = await Paciente.findAll({
		attributes: ['peso', 'altura'],
		where: {
		  email: req.body.email
		 }
		}); 

	if(Object.keys(users).length < 0) {
			return res.status(400).json({
				erro: true,
				mensagem: "Erro: Email não encontrado!"
			})
		}
	const altura = Utils.altura(users[0].dataValues.altura); 
	return res.json({
		altura: altura
	})       
	});*/


router.post('/registrar', async(req, res) => {
	var session = utils.decrypt(req.body.session);
	var data = Chronos.getEmailSession(session);
	var salt = bcrypt.genSaltSync(13);
	const psw = bcrypt.hashSync(req.body.password, salt);
	const _uuid = await utils.generatePacientUUID();

	const dt = { ...data, senha: psw, uuid: _uuid };

	await Paciente.create(dt) //aqui
		.then(()=> {
			
			res.render('feedback', {
				title: "Cal - Feedback",
				feedback_title: "Sucesso!",
				feedback: "Paciente cadastrado com sucesso.",
				color: "success-1",
				img: "success.jpg"
			});

		}).catch((err) => {
			res.render('feedback', {
				title: "Cal - Feedback",
				feedback_title: "Erro ao cadastrar",
				feedback: "Erro ao cadastrar.",
				color: "error-1",
				img: "error.png"
			});
		});

	Chronos.freeEmail(session);
})

//Função de login 
router.post('/login', async(req, res) => {

	const users = await Paciente.findAll({
		attributes: ['email', 'uuid', 'senha'],
		where: {
			email: req.body.email
		}
	}); 

	if(Object.keys(users).length < 0) {
		res.render('feedback', {
			title: "Cal - Feedback",
			feedback_title: "Erro ao entrar.",
			feedback: "Email não encontrado no sistema.",
			color: "error-1",
			img: "error.png"
		});
	}

	var pass = await bcrypt.compare(req.body.senha, users[0].dataValues.senha);

	if(!pass)
	{
		res.render('feedback', {
			title: "Cal - Feedback",
			feedback_title: "Erro ao entrar.",
			feedback: "Senha incorreta.",
			color: "error-1",
			img: "error.png"
		});
	}

	const token = utils.encrypt(`${users[0].dataValues.email}&${users[0].dataValues.uuid}`, 24*60);
	utils.setCookie(res, "token", token, 24*60);

	res.redirect('../site/perfil');
});

//Função de login 
router.post('/logout', verifyJWT, async(req, res, next) => {
	utils.deleteCookie(res, 'token');
	//sucesso
});

async function verifyJWT(req, res, next) { 
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

//funnção para mostrar os dados do banco 
router.get('/teste', async(req, res) => {
	
	Paciente.findAll().then(function(infos){
		res.render('teste', {infos: infos});
	}) 
		
})



//Exportando router
module.exports= router;