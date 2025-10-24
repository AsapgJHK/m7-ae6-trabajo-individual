// db.js
const { Sequelize } = require('sequelize');

// Crear la INSTANCIA de Sequelize (el objeto de conexión)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'project_management.sqlite', 
  logging: false, 
});

// Exportar DIRECTAMENTE la INSTANCIA
module.exports = sequelize;