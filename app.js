require("dotenv").config();

const express = require('express');
const app = express();
const Paciente = require('./models/Paciente');
const Utils = require('./Utils/utils');

app.use(express.json());

app.get("/", async(req, res)=> {
    res.send("Página Inicial");
});

app.get("/calcularIMC", async(req, res)=> {
    
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
    const imc = Utils.imc(users[0].dataValues.peso, users[0].dataValues.altura);    
    return res.json({
        imc: imc
    })       
    
});


app.post("/registrarPaciente", async(req, res)=> {
   
    const users = await Paciente.findAll({
        where: {
          email: req.body.email
         }
        }); 
        
    if(Object.keys(users).length > 0) {
        return res.status(400).json({
                erro: true,
                mensagem: "Erro: Email já cadastrado!"
            })
        }

    await Paciente.create(req.body)
    .then(()=> {
        return res.json({
            erro: false,
            mensagem: "Paciente cadastrado com sucesso!"
        })

    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Paciente não cadastrado!"
        })

    });

    //res.send("Registrar Paciente");
});

app.listen(8080, () =>{
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});

