require("dotenv").config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {

    host:process.env.DB_HOST,
    dialect: 'mysql'
});

sequelize.authenticate()
.then(function(){
    console.log("Conexão com sucesso");

}).catch(function(err){
    console.log("Erro de conexão");
    console.log(err);
})
module.exports = sequelize;
