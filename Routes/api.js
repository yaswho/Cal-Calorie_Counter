const express = require('express');
const router = express.Router();

//Função para registrar o paciente
router.post("/registrarPaciente", async(req, res)=> {
   
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

});

//Função para calcular IMC 
router.get("/calcularIMC", async(req, res)=> {
    
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


//Exportando router
module.exports= router;