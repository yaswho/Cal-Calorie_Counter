const sequelize = require('sequelize');
const { DOUBLE } = require('sequelize');
const { Sequelize } = require('sequelize');
const db = require('./db');


const Keys = db.define('Keys', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    namespace:{
        type: Sequelize.STRING,
        allowNull: false
    },
    key:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Criar tabela 
Keys.sync();
module.exports = Keys; 