const {DataTypes} = require("sequelize");
const sequelize = require('../config/sequelize.config');
const TipoComida = require('./tipoComida.model');
const Restaurante = require('./restaurante.model');


const menu = sequelize.define("menu", {
    fecha:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        validate: {
            notEmpty: { msg: "La fecha es obligatoria" }
        }
    }
}, { timestamps: false });

Restaurante.belongsToMany(TipoComida, {through: menu});

TipoComida.belongsToMany(Restaurante, {through: menu});

//El belongsTo es como un innerJoin al usar el Include
menu.belongsTo(TipoComida, {foreignKey: 'tipoId' });

menu.belongsTo(Restaurante, {foreignKey: 'restauranteId' });

module.exports = menu;