'use strict';
import mongoose from 'mongoose';
import Prestamos from './prestamos.model.js';
import Cuentas from '../cuenta/cuenta.model.js';

export const crearPrestamo = async (req, res) => {
    try {
        const { cuentaId, cantidad_prestada, plazo_meses } = req.body;

        // Validación de campos
        if (!cuentaId || !cantidad_prestada || !plazo_meses) {
            return res.status(400).json({
                success: false,
                message: 'Cuenta, cantidad prestada y plazo en meses son obligatorios'
            });
        }

        // Buscar la cuenta por _id
        const cuenta = await Cuentas.findById(cuentaId);
        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        // Verificar que la cuenta pertenezca al usuario
        if (cuenta.usuarioId.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para usar esta cuenta'
            });
        }

        // Calcular interés y monto de cuotas
        const tasa_interes = 12; // ejemplo 12%
        const total_con_interes = cantidad_prestada + (cantidad_prestada * tasa_interes / 100);
        const monto_cuota = total_con_interes / plazo_meses;

        // Crear préstamo
        const nuevoPrestamo = new Prestamos({
            cuentaId: cuenta._id,
            cantidad_prestada,
            cantidad_pendiente: total_con_interes,
            tasa_interes,
            plazo_meses,
            monto_cuota
        });

        await nuevoPrestamo.save();

        return res.status(201).json({
            success: true,
            message: 'Préstamo creado correctamente',
            data: nuevoPrestamo
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener todos los préstamos de un usuario
export const obtenerPrestamosUsuario = async (req, res) => {
    try {
        const cuentas = await Cuentas.find({ usuarioId: req.uid });
        if (!cuentas.length) {
            return res.status(404).json({
                success: false,
                message: 'No tienes cuentas registradas'
            });
        }

        const cuentasIds = cuentas.map(c => c._id);

        const prestamos = await Prestamos.find({ cuentaId: { $in: cuentasIds } })
            .populate('cuentaId', 'numeroCuenta tipoCuenta')
            .sort({ fecha: -1 });

        res.status(200).json({
            success: true,
            data: prestamos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener préstamos',
            error: error.message
        });
    }
};

export const obtenerPrestamosPorCuenta = async (req, res) => {
    try {
        const { cuentaId, numeroCuenta } = req.params;

        let cuenta;

        if (cuentaId) {
            cuenta = await Cuentas.findOne({ _id: cuentaId, usuarioId: req.uid });
        } else if (numeroCuenta) {
            cuenta = await Cuentas.findOne({ numeroCuenta, usuarioId: req.uid });
        }

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada o no pertenece al usuario'
            });
        }

        const prestamos = await Prestamos.find({ cuentaId: cuenta._id })
            .populate('cuentaId', 'numeroCuenta tipoCuenta')
            .sort({ fecha: -1 });

        if (!prestamos.length) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron préstamos para la cuenta'
            });
        }

        res.status(200).json({
            success: true,
            data: prestamos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener préstamos por cuenta',
            error: error.message
        });
    }
};