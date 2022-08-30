const express = require('express');
const router = express.Router();
const utils = require('./../Utils/utils');
const Paciente = require('../models/Paciente');
const Chronos = require('./../Utils/Chronos'); 

router.get('/', (req,res) => {

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
		res.redirect('/perfil');
		return;		
	}
	res.render("login", {
        title: "Cal - Login"
    });
})

router.get('/perfil', utils.verifyJWT, async (req, res, next)=> {

	if(utils.hasCookie(req, "token"))
	{

		const query = utils.createURLFeedback("Cal - Feedback",
			"Token não encontrado.",
			"Favor logar novamente.",
			"error-1",
			"error.png");

		res.redirect(query);
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

	//res.redirect('../site/pontos');

})


router.get('/pontos', utils.verifyJWT, async(req, res, next)=>{

	res.render("pontos", {
        title: "Cal - Pontos"
    });
})

router.get('/registro/:authId',(req,res) =>{

	if(Chronos.hasEmailTime(utils.decrypt(req.params.authId)))
	{
		const query = utils.createURLFeedback("Cal - Feedback",
			"Erro ao cadastrar",
			"Requisite outra chave de segurança preenchendo o formulário de cadastro novamente.",
			"error-1",
			"error.png");

		res.redirect(query);

	} else res.render('registro', { title: "Cal - Finalize o registro", session: req.params.authId });

});

router.get('/feedback', async(req, res, next) => {
	const feedback = JSON.parse(utils.decrypt(req.query.r));
	res.render('feedback', {...feedback});
})

module.exports = router;