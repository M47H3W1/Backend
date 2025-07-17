const TipoComida = require('../models/tipoComida.model');

module.exports.CreateTipoComida = async (request, response) => {
    const { nombre, paisOrigen } = request.body;
    try {
        const tipoComida = await TipoComida.create({
            nombre,
            paisOrigen
        });
        response.status(201).json({
            status: "ok",
            message: "Tipo de comida creado correctamente",
            data: tipoComida
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el tipo de comida",
            error: error.message
        });
    }
}