const {DataTypes} = require("sequelize");
const sequelize = require('../config/sequelize.config');
const TipoRestaurante = require('./menu.model');
const Restaurante = require('./restaurante.model');


const menu = sequelize.define("menu", {
    fecha:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
            notEmpty: { msg: "La fecha es obligatoria" }
        }
    }
}, { timestamps: false });

Restaurante.belongsToMany(TipoRestaurante, {through: menu});

TipoRestaurante.belongsToMany(Restaurante, {through: menu});

//El belongsTo es como un innerJoin al usar el Include
menu.belongsTo(TipoRestaurante, {foreignKey: 'tipoId' });

menu.belongsTo(Restaurante, {foreignKey: 'restauranteId' });

module.exports = menu;