'use strict';

import Admin from '../admin/admin.model.js';

export const loginAdmin = async (req, res) => {

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

import jwt from 'jsonwebtoken';
import Usuario from '../usuarios/usuarios.model.js';

export const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Buscar usuario por nombre
        const user = await Usuario.findOne({ name });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Usuario desactivado',
            });
        }

        // Comparación directa (porque tu modelo no usa bcrypt)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta',
            });
        }

        const token = jwt.sign(
            { uid: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user._id,
                    name: user.name
                },
                token,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el login',
            error: error.message,
        });
    }
};
