const Menu = require('../models/menu.model');
const TipoComida = require('../models/tipoComida.model');
const Restaurantes = require('../models/restaurante.model');

module.exports.CreateMenu = async (request, response) => {
    const { fecha, tipoComidaId, restaurante_id } = request.body;

    if (!tipoComidaId || !restaurante_id) {
        return response.status(400).json({
            status: "error",
            message: "tipoComidaId y restaurante_id son obligatorios"
        });
    }

    try {
        // Validar que el restaurante existe usando _id
        const restaurante = await Restaurantes.findOne({ where: { _id: restaurante_id } });
        if (!restaurante) {
            return response.status(404).json({
                status: "error",
                message: "El restaurante no existe"
            });
        }

        // Validar que el tipo de comida existe
        const tipoComida = await TipoComida.findByPk(tipoComidaId);
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "El tipo de comida no existe"
            });
        }

        // Verificar si ya existe un menú para esta combinación
        const existingMenu = await Menu.findOne({
            where: {
                restaurante_id,
                tipoComidaId
            }
        });

        if (existingMenu) {
            return response.status(409).json({
                status: "error",
                message: "Ya existe un menú para esta combinación de restaurante y tipo de comida"
            });
        }

        // Crear el nuevo menú (el id se genera automáticamente)
        const newMenu = await Menu.create({
            fecha: fecha || new Date(),
            tipoComidaId,
            restaurante_id
        });

        response.status(201).json({
            status: "ok",
            message: "Menú creado correctamente",
            data: newMenu
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el menú",
            error: error.message
        });
    }
}

// Obtener los tipos de comida que ofrece un restaurante en concreto
module.exports.getMenuByRestaurante = async (request, response) => {    
    try {
        const menus = await Menu.findAll({
            where: { restaurante_id: request.params.id },
            include: [
                { model: TipoComida }
            ]
        });
        if (!menus.length) {
            return response.status(404).json({
                status: "error",
                message: "No se encontraron tipos de comida para el restaurante solicitado"
            });
        }
        // Extraer solo los tipos de comida y evitar duplicados
        const tiposComida = [];
        const ids = new Set();
        for (const menu of menus) {
            if (menu.TipoComida && !ids.has(menu.TipoComida.id)) {
                tiposComida.push(menu.TipoComida);
                ids.add(menu.TipoComida.id);
            }
        }
        response.json(tiposComida);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los tipos de comida",
            error: error.message
        });
    }
}

// Dado el idTipoComida se obtiene los restaurantes que ofrecen ese tipo de comida
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

        const restaurantes = await Restaurantes.findAll({
            include: [{
                model: TipoComida,
                where: { id: idTipoComida },
                attributes: []
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

// Obtener un menú por su ID
module.exports.getMenuById = async (request, response) => {
    try {
        const menu = await Menu.findByPk(request.params.id, {
            include: [
                { model: TipoComida },
                { model: Restaurantes }
            ]
        });
        if (!menu) {
            return response.status(404).json({
                status: "error",
                message: "Menú no encontrado"
            });
        }
        response.json(menu);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener el menú",
            error: error.message
        });
    }
};

// Actualizar un menú por su ID
module.exports.updateMenu = async (request, response) => {
    try {
        const { fecha, tipoComidaId, restaurante_id } = request.body;
        
        // Buscar el menú por su ID
        const menu = await Menu.findByPk(request.params.id);
        if (!menu) {
            return response.status(404).json({
                status: "error",
                message: "Menú no encontrado"
            });
        }

        // Validar las claves foráneas si se proporcionan
        if (restaurante_id) {
            const restaurante = await Restaurantes.findOne({ where: { _id: restaurante_id } });
            if (!restaurante) {
                return response.status(404).json({
                    status: "error",
                    message: "El restaurante no existe"
                });
            }
        }

        if (tipoComidaId) {
            const tipoComida = await TipoComida.findByPk(tipoComidaId);
            if (!tipoComida) {
                return response.status(404).json({
                    status: "error",
                    message: "El tipo de comida no existe"
                });
            }
        }

        // Actualizar el menú
        const [updated] = await Menu.update(
            {
                fecha: fecha || menu.fecha,
                tipoComidaId: tipoComidaId || menu.tipoComidaId,
                restaurante_id: restaurante_id || menu.restaurante_id
            },
            { where: { id: request.params.id } }
        );

        if (updated) {
            const updatedMenu = await Menu.findByPk(request.params.id, {
                include: [
                    { model: TipoComida },
                    { model: Restaurantes }
                ]
            });
            return response.json({
                status: "ok",
                message: "Menú actualizado correctamente",
                data: updatedMenu
            });
        }

        throw new Error("Error al actualizar el menú");
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el menú",
            error: error.message
        });
    }
};

// Eliminar un menú por su ID
module.exports.deleteMenu = async (request, response) => {
    try {
        const deleted = await Menu.destroy({
            where: { id: request.params.id }
        });
        
        if (!deleted) {
            return response.status(404).json({
                status: "error",
                message: "Menú no encontrado"
            });
        }
        
        response.json({
            status: "ok",
            message: "Menú eliminado correctamente"
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el menú",
            error: error.message
        });
    }
};

// Listar todos los menús
module.exports.getAllMenus = async (request, response) => {
    try {
        const menus = await Menu.findAll({
            include: [
                { model: TipoComida },
                { model: Restaurantes }
            ]
        });
        response.json(menus);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los menús",
            error: error.message
        });
    }
};
