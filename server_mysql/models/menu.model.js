const {DataTypes} = require("sequelize");
const sequelize = require('../config/sequelize.config');
const TipoComida = require('./tipoComida.model');
const Restaurante = require('./restaurante.model');


const menu = sequelize.define("Menu", {
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    }
}, { 
    timestamps: false,
    tableName: 'Menus'
});

Restaurante.belongsToMany(TipoComida, { through: menu });
TipoComida.belongsToMany(Restaurante, { through: menu });

module.exports = menu;