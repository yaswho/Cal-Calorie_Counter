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

router.get('/registrar', (req,res) => {
	res.render("registrar", {
        title: "Cal - Registro"
    });
})

router.get('/login', async (req,res) => {

	var t = utils.hasCookie(req, 'token');

	res.render("login", {
        title: "Cal - Login",
		token: t
    });
})

router.get('/perfil', utils.verifyJWT, async (req, res, next) => {

	const user = req.user;
	var img;

	if(user['imagem'] == null)
	{
		img = '/public/imgs/usuario.jpg'
	} else img = user.imagem;

	const imc = utils.imc(user.peso, user.altura);   
	//Imprimir no HTML 
	res.render("perfil", {
        title: "Cal - Perfil",
		name: user.nome_paciente,
		altura: user.altura,
		peso: user.peso,
		imc: imc,
		img: img
    });

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