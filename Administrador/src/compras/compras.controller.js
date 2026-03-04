'use strict';

import mongoose from 'mongoose';
import Compras from './compras.model.js';

// Obtener todas las compras con paginación de 10 items por página
export const getCompras = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { isActive: true };

        const [total, compras] = await Promise.all([
            Compras.countDocuments(query),
            Compras.find(query)
                .populate('producto', 'nombre')
                .populate('cuenta', 'numeroCuenta')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        return res.status(200).json({
            success: true,
            total,
            compras
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las compras',
            error: err.message
        });
    }
};

// Obtener compras por año y mes en un mismo método
export const getComprasByYearAndMonth = async (req, res) => {
    try {
        const { year, month } = req.params;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'El año y el mes son requeridos'
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const query = {
            isActive: true,
            fechaSolicitud: {
                $gte: startDate,
                $lte: endDate
            }
        };

        const compras = await Compras.find(query)
            .populate('producto', 'nombre')
            .populate('cuenta', 'numeroCuenta');

        return res.status(200).json({
            success: true,
            total: compras.length,
            compras
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las compras por fecha',
            error: err.message
        });
    }
};

// Obtener las compras hechas por una cuenta
export const getComprasByCuenta = async (req, res) => {
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
            cuenta: cuenta._id,
            isActive: true
        };

        const compras = await Compras.find(query)
            .populate('producto', 'nombre')
            .populate('cuenta', 'numeroCuenta');

        return res.status(200).json({
            success: true,
            total: compras.length,
            compras
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las compras de la cuenta',
            error: err.message
        });
    }
};
