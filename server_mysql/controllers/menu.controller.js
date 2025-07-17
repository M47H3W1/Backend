const menu = require('../models/menu.model');

module.exports.CreateMenu = async (request, response) => {
    const { fecha, tipoId, restauranteId } = request.body;
    try {
        const newMenu = await menu.create({
            fecha,
            tipoId,
            restauranteId
        });
        response.status(201).json({
            status: "ok",
            message: "Menu creado correctamente",
            data: newMenu
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el menu",
            error: error.message
        });
    }
}

//Obtener los tipos de comida que ofrece un restaurante en concreto
module.exports.getMenuByRestaurante = async (request, response) => {    
    try {
        const menus = await menu.findAll({
            where: { restauranteId: request.params.id },
            include: [Restaurante, TipoRestaurante]
        });
        if (!menus.length) {
            return response.status(404).json({
                status: "error",
                message: "No se encontraron menus para el restaurante solicitado"
            });
        }
        response.json(menus);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los menus",
            error: error.message
        });
    }
}

