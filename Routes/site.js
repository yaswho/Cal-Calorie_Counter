const express = require('express');
const router = express.Router();
const utils = require('./../Utils/utils');
const Chronos = require('./../Utils/Chronos');

router.get('/', (req,res)=>{

	res.render("index");
})

router.get('/registro/:authId',(req,res) =>{

	if(Chronos.hasEmailTime(utils.decrypt(req.params.authId)))
	{
		res.send("oops!");
	} else res.render('registro', { session: req.params.authId });

})

module.exports = router;