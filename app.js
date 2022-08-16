require("dotenv").config();

const express = require('express');
const app = express();
const Paciente = require('./models/Paciente');

app.use(express.json());

app.get("/", async(req, res)=> {
    res.send("Página Inicial");
});

app.post("/registrarPaciente", async(req, res)=> {
    //console.log(req.body);
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

