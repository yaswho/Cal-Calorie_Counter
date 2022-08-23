const express = require('express');
const router = express.Router();
const utils = require('./../Utils/utils');
const Paciente = require('../models/Paciente');
const Chronos = require('./../Utils/Chronos');

router.get('/', (req,res)=>{

	res.render("index", {
        title: "Cal - Página Inicial"
    });
})

router.get('/registrar', (req,res)=>{

	res.render("registrar", {
        title: "Cal - Registro"
    });
})

router.get('/login', async (req,res)=>{

	if(utils.hasCookie(req, "token"))
	{
		res.redirect('../site/perfil');
	}
	res.render("login", {
        title: "Cal - Login"
    });
})

router.get('/perfil', async (req,res)=> {

	if(utils.hasCookie(req, "token"))
	{
		res.render('feedback', {
			title: "Cal - Feedback",
			feedback_title: "Token não encontrado",
			feedback: "Favor logar novamente.",
			color: "error-1",
			img: "error.png"
		});

		return;
	}

	const users = await Paciente.findAll({
		attributes: ['peso', 'altura', 'nome_paciente'],
		where: {
		  uuid: utils.getUUIDFromToken(req.cookies.token)
		 }
		}); 

	const imc = utils.imc(users[0].dataValues.peso, users[0].dataValues.altura);   

	//Imprimir no HTML 
	res.render("perfil", {
        title: "Cal - Perfil",
		name: users[0].dataValues.nome_paciente,
		altura: users[0].dataValues.altura,
		peso: users[0].dataValues.peso,
		imc: imc 

    });
})

router.get('/pontos', (req,res)=>{

	res.render("pontos", {
        title: "Cal - Pontos"
    });
})

router.get('/registro/:authId',(req,res) =>{

	if(Chronos.hasEmailTime(utils.decrypt(req.params.authId)))
	{
		res.render('feedback', {
			title: "Cal - Feedback",
			feedback_title: "Erro ao cadastrar",
			feedback: "Requisite outra chave de segurança preenchendo o formulário de cadastro novamente.",
			color: "error-1",
			img: "error.png"
		});
	} else res.render('registro', { title: "Cal - Finalize o registro", session: req.params.authId });

})

module.exports = router;