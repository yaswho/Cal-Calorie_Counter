const sequelize = require('sequelize');
const { DOUBLE } = require('sequelize');
const { Sequelize } = require('sequelize');
const db = require('./db');


const Paciente = db.define('Pacientes', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idade:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    altura:{
        type: Sequelize.DOUBLE,
        allowNull: false    
    },
    peso:{
        type: Sequelize.DOUBLE,
        allowNull: false    
    },
    nome_paciente:{
        type: Sequelize.STRING,
        allowNull: false     
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    sexo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    },
    //var para pesos antigos
    peso_anterior: {
        type: Sequelize.STRING,
        allowNull: false
    },
    //var para alturas antigas
    altura_anterior: {
        type: Sequelize.STRING,
        allowNull: false
    },
    //Identificador Único Universal de paciente
    uuid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imagem: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pontos: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    refreshToken: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    expiresIn: {
        type: Sequelize.BIGINT.UNSIGNED,
        defaultValue: 0
    }
});

//Criar tabela 
Paciente.sync();
module.exports = Paciente; 