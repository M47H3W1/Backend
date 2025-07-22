const menu = require('../models/menu.model');
const TipoComida = require('../models/tipoComida.model');
const Restaurante = require('../models/restaurante.model');

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
            include: [Restaurante, TipoComida] // Cambia TipoRestaurante por TipoComida
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

//Se pide que dado el idTIpoComida se obtenga los restaurantes que ofrecen ese tipo de comida, primero validar que el id existe, si no existe este tipo de comida lo indica al usuario

module.exports.getRestaurantesByTipoComida = async (request, response) => {
    const { idTipoComida } = request.params;
    if (!idTipoComida) {
        return response.status(400).json({
            status: "error",
            message: "El idTipoComida es obligatorio"
        });
    }
    try {
        // Validar que el tipo de comida exista
        const tipoComida = await TipoComida.findByPk(idTipoComida);
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "El tipo de comida no existe"
            });
        }

        const restaurantes = await Restaurante.findAll({
            include: [{
                model: TipoComida,
                where: { id: idTipoComida }
            }]
        });
        if (!restaurantes.length) {
            return response.status(404).json({
                status: "error",
                message: "No se encontraron restaurantes para el tipo de comida solicitado"
            });
        }
        response.json(restaurantes);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los restaurantes",
            error: error.message
        });
    }
}
