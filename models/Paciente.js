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
        allowNull: false,
    },
    altura:{
        type: Sequelize.DOUBLE,
        allowNull: false,     
    },
    peso:{
        type: Sequelize.DOUBLE,
        allowNull: false,     
    },
    nome_paciente:{
        type: Sequelize.STRING,
        allowNull: false,     
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    sexo:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    
});
//Criar tabela 
Paciente.sync();
module.exports = Paciente; 