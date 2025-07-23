const sequelize = require('../config/sequelize.config');
const Restaurantes = require('./restaurante.model');
const TipoComida = require('./tipoComida.model');
const Menu = require('./menu.model');

// Relación muchos a muchos entre Restaurantes y TipoComida a través de Menu
Restaurantes.belongsToMany(TipoComida, { 
    through: Menu, 
    foreignKey: 'restauranteId',
    otherKey: 'tipoComidaId',
    as: 'tiposComida' 
});

TipoComida.belongsToMany(Restaurantes, { 
    through: Menu, 
    foreignKey: 'tipoComidaId',
    otherKey: 'restauranteId',
    as: 'restaurantes' 
});

// Relaciones directas del Menu con Restaurantes y TipoComida
Menu.belongsTo(Restaurantes, { 
    foreignKey: 'restauranteId', 
    as: 'restaurante' 
});

Menu.belongsTo(TipoComida, { 
    foreignKey: 'tipoComidaId', 
    as: 'tipoComida' 
});

// Relaciones inversas
Restaurantes.hasMany(Menu, { 
    foreignKey: 'restauranteId', 
    as: 'menus' 
});

TipoComida.hasMany(Menu, { 
    foreignKey: 'tipoComidaId', 
    as: 'menus' 
});

// Exportar los modelos para uso en otros archivos
module.exports = {
    sequelize,
    Restaurantes,
    TipoComida,
    Menu
};
