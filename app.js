require("dotenv").config();

//Configurações 
const express = require('express');
const app = express();
const cors = require('cors');
const Paciente = require('./models/Paciente');
const Utils = require('./Utils/utils');
const api = require('./Routes/api');
const site = require('./Routes/site');
const nodemailer = require('nodemailer');
const Chronos = require('./Utils/Chronos.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');  
const helmet = require("helmet");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './view')
app.use(express.static("./public"));

//Rotas 
app.use('/api', api)
app.use('/site', site)

//Função para criar transportador 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
	user: process.env.EMAIL,
	pass: process.env.EMAIL_PASSWORD
  }
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

