const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'node-complete',
    'alta',
    'LaluLintas#2021',
    {
      dialect: 'mysql',
      host: 'localhost',
    },
);

module.exports = sequelize;
