'use strict';

import Admin from '../admin/admin.model.js';
import Usuario from '../usuarios/usuarios.model.js';

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Verificar datos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y password son obligatorios'
            });
        }

        // Buscar admin por email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin no encontrado'
            });
        }

        // Verificar estado
        if (admin.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Admin inactivo'
            });
        }

        // Comparar password SIN hash
        if (password !== admin.password) {
            return res.status(400).json({
                success: false,
                message: 'Password incorrecto'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Error en login',
            error: error.message
        });
    }
};

export const loginUsuario = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Validar datos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y password son obligatorios'
            });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar estado (si existe en el modelo)
        if (usuario.status && usuario.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Usuario inactivo'
            });
        }

        // Comparar password SIN encriptar
        if (password !== usuario.password) {
            return res.status(400).json({
                success: false,
                message: 'Password incorrecto'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            usuario: {
                id: usuario._id,
                name: usuario.name,
                email: usuario.email
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Error en login',
            error: error.message
        });
    }
};

