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
