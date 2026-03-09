import mongoose from 'mongoose';
import Retiro from './retiros.model.js';

// Listar retiros totales con paginación
export const getRetiros = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;

        const [total, retiros] = await Promise.all([
            Retiro.countDocuments(),
            Retiro.find()
                .populate('cuentaId', 'numeroCuenta tipoCuenta')
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ date: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            retiros
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los retiros',
            error: err.message
        });
    }
};

// Obtener retiros hechos en un año y mes
export const getRetirosByYearAndMonth = async (req, res) => {
    try {
        const { year, month } = req.params;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const query = {
            date: {
                $gte: startDate,
                $lte: endDate
            }
        };

        const retiros = await Retiro.find(query)
            .populate('cuentaId', 'numeroCuenta tipoCuenta')
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            total: retiros.length,
            retiros
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los retiros por fecha',
            error: err.message
        });
    }
};

// Obtener retiros hechos por una cuenta
export const getRetirosByCuenta = async (req, res) => {
    try {
        const { numeroCuenta } = req.params;

        // Primero buscar la cuenta por el número de cuenta
        const cuenta = await mongoose.model('Cuentas').findOne({ numeroCuenta });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: `No se encontró la cuenta con el número ${numeroCuenta}`
            });
        }

        const query = {
            cuentaId: cuenta._id
        };

        const retiros = await Retiro.find(query)
            .populate('cuentaId', 'numeroCuenta tipoCuenta')
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            total: retiros.length,
            retiros
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los retiros de la cuenta',
            error: err.message
        });
    }
};
