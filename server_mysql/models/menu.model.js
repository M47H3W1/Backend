const {DataTypes} = require("sequelize");
const sequelize = require('../config/sequelize.config');

const Menu = sequelize.define("Menu", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    restaurante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurantes',
            key: '_id'
        }
    },
    tipoComidaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TipoComidas',
            key: 'id'
        }
    }
}, { 
    timestamps: false,
    tableName: 'Menus',
});

module.exports = Menu;