const sequelize = require('sequelize');
const { Sequelize } = require('sequelize');
const db = require('./db');

const Paciente = db.define('nome_do_paciente', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_paciente:{
        type: Sequelize.STRING,
        allowNull: false,     
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    }

});
//Criar tabela 
Paciente.sync();
module.exports = Paciente; 