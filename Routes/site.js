const express = require('express');
const router = express.Router();
const utils = require('./../Utils/utils');
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

router.get('/login', (req,res)=>{

	res.render("login", {
        title: "Cal - Login"
    });
})

router.get('/perfil', (req,res)=>{

	res.render("perfil", {
        title: "Cal - Perfil"
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