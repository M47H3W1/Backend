const sesquelize = require('../config/sequelize.config');
const Restaurantes = require('./restaurante.model');
const TipoComida = require('./tipoComida.model');
const Menu = require('./menu.model');

Restaurantes.belongsToMany(TipoComida, { through: Menu , foreignKey: 'RestauranteId' , as : 'tiposComida' });

TipoComida.belongsToMany(Restaurantes, { through: Menu , foreignKey: 'TipoComidaId' , as : 'restaurantes' });


Menu.belongsTo(Restaurantes, { foreignKey: 'RestauranteId', as: 'restaurante' });
Menu.belongsTo(TipoComida, { foreignKey: 'TipoComidaId', as: 'tipoComida' });

// Exportar los modelos para uso en otros archivos
module.exports = {
    sesquelize,
    Restaurantes,
    TipoComida,
    Menu
};
