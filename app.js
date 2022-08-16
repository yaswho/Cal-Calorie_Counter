require("dotenv").config();

//Configurações 
const express = require('express');
const app = express();
const Paciente = require('./models/Paciente');
const Utils = require('./Utils/utils');
const api = require('./Routes/api');
const site = require('./Routes/site');

app.use(express.json());

//Rotas 
app.use('/api', api)
app.use('/site', site)
app.set('view engine', 'ejs');
app.set('views', './view')

//Direcionando para o Frontend 
app.get("/", async(req, res)=> {
    res.redirect('/site');
});

//Indicando servidor rodando 
app.listen(process.env.PORT, () =>{
    console.log(`Servidor iniciado em http://localhost:${process.env.PORT}/`);
});

