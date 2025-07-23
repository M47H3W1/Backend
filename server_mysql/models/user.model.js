const {DataTypes} = require('sequelize');
 const sequelize = require('..sequelize.config.js'); 

 const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        validate: {
            notNull: { msg: "El id es obligatorio" }
        }
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El nombre de usuario es obligatorio" },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El correo electrónico es obligatorio" },
            isEmail: { msg: "El correo electrónico debe ser válido" }
        }
    }
}, {
    timestamps: false
});

module.exports = Usuario;
