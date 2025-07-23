const Usuario = require('../models/user.model.js');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
module.exports.CreateUser = async (request, response) => {
    const { userName, email } = request.body;

    if (!userName || !email) {
        return response.status(400).json({
            status: "error",
            message: "userName y email son obligatorios"
        });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { userName } });
        if (existingUser) {
            return response.status(409).json({
                status: "error",
                message: "El nombre de usuario ya está en uso"
            });
        }

        // Crear el nuevo usuario
        const newUser = await Usuario.create({ userName, email });

        response.status(201).json({
            status: "ok",
            message: "Usuario creado correctamente",
            data: newUser
        });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
}

// Obtener todos los usuarios
module.exports.getAllUsers = async (request, response) => {
    try {
        const users = await Usuario.findAll();
        response.json(users);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        response.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

// Obtener un usuario por su ID
module.exports.getUserById = async (request, response) => {
    try {
        const user = await Usuario.findByPk(request.params.id);
        if (!user) {
            return response.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        response.json(user);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error al obtener el usuario",
            error: error.message
        });
    }
};

// Actualizar un usuario por su ID
module.exports.updateUser = async (request, response) => {
    try {
        const { userName, email } = request.body;
        
        // Buscar el usuario por su ID
        const user = await Usuario.findByPk(request.params.id);
        if (!user) {
            return response.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        // Verificar si el userName ya está en uso por otro usuario
        if (userName && userName !== user.userName) {
            const existingUser = await Usuario.findOne({ 
                where: { 
                    userName,
                    id: { [require('sequelize').Op.ne]: request.params.id }
                } 
            });
            if (existingUser) {
                return response.status(409).json({
                    status: "error",
                    message: "El nombre de usuario ya está en uso"
                });
            }
        }

        // Verificar si el email ya está en uso por otro usuario
        if (email && email !== user.email) {
            const existingEmail = await Usuario.findOne({ 
                where: { 
                    email,
                    id: { [require('sequelize').Op.ne]: request.params.id }
                } 
            });
            if (existingEmail) {
                return response.status(409).json({
                    status: "error",
                    message: "El email ya está en uso"
                });
            }
        }

        // Actualizar el usuario
        const [updated] = await Usuario.update(
            {
                userName: userName || user.userName,
                email: email || user.email
            },
            { where: { id: request.params.id } }
        );

        if (updated) {
            const updatedUser = await Usuario.findByPk(request.params.id);
            return response.json({
                status: "ok",
                message: "Usuario actualizado correctamente",
                data: updatedUser
            });
        }

        throw new Error("Error al actualizar el usuario");
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

// Eliminar un usuario por su ID
module.exports.deleteUser = async (request, response) => {
    try {
        const deleted = await Usuario.destroy({
            where: { id: request.params.id }
        });
        
        if (!deleted) {
            return response.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        
        response.json({
            status: "ok",
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el usuario",
            error: error.message
        });
    }

    const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' }); //Validez de 30 días en el SERVIDOR  
    };
};