const {DataTypes} = require("sequelize");
const sequelize = require('../config/sequelize.config');

const menu = sequelize.define("Menu", {
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    }
}, { 
    timestamps: false,
    tableName: 'Menus',

});

module.exports = menu;