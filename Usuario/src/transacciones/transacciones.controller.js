'use strict';

import Transacciones from './transacciones.model.js';
import Cuentas from '../Cuenta/cuenta.model.js';

/* =========================================
   CREAR TRANSACCIÓN
========================================= */
export const crearTransaccion = async (req, res) => {
    try {

        const { numeroCuentaOrigen } = req.params;
        const { numeroCuentaDestino, amount, description, type } = req.body;

        if (!numeroCuentaDestino || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Cuenta destino y monto son obligatorios'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El monto debe ser mayor a 0'
            });
        }

        const cuentaOrigen = await Cuentas.findOne({ numeroCuenta: numeroCuentaOrigen });
        const cuentaDestino = await Cuentas.findOne({ numeroCuenta: numeroCuentaDestino });

        if (!cuentaOrigen) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta origen no encontrada'
            });
        }

        if (!cuentaDestino) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta destino no encontrada'
            });
        }

        if (cuentaOrigen.usuarioId.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para usar esta cuenta'
            });
        }

        if (!cuentaOrigen.isActive || !cuentaDestino.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Una de las cuentas está inactiva'
            });
        }

        if (numeroCuentaOrigen === numeroCuentaDestino) {
            return res.status(400).json({
                success: false,
                message: 'No puedes transferirte a la misma cuenta'
            });
        }

        if (cuentaOrigen.saldo < amount) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente'
            });
        }

        cuentaOrigen.saldo -= amount;
        cuentaDestino.saldo += amount;

        await cuentaOrigen.save();
        await cuentaDestino.save();

        const nuevaTransaccion = new Transacciones({
            idFromUsuario: cuentaOrigen._id,
            idToUsuario: cuentaDestino._id,
            amount,
            type: type || 'transferencia',
            description: description || 'sin descripción'
        });

        await nuevaTransaccion.save();

        return res.status(201).json({
            success: true,
            message: 'Transferencia realizada correctamente',
            data: nuevaTransaccion
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};


/* =========================================
   OBTENER TODAS MIS TRANSACCIONES
========================================= */
export const obtenerMisTransacciones = async (req, res) => {
    try {

        const cuentasUsuario = await Cuentas.find({ usuarioId: req.uid });

        if (!cuentasUsuario.length) {
            return res.status(404).json({
                success: false,
                message: 'No tienes cuentas registradas'
            });
        }

        const idsCuenta = cuentasUsuario.map(c => c._id);

        const transacciones = await Transacciones.find({
            $or: [
                { idFromUsuario: { $in: idsCuenta } },
                { idToUsuario: { $in: idsCuenta } }
            ]
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            transacciones
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener transacciones'
        });
    }
};


/* =========================================
   OBTENER TRANSACCIONES POR CUENTA (TODAS)
========================================= */
export const obtenerTransaccionesPorCuenta = async (req, res) => {
    try {

        const { numeroCuenta } = req.params;

        const cuenta = await Cuentas.findOne({ numeroCuenta });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        if (cuenta.usuarioId.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver estas transacciones'
            });
        }

        const transacciones = await Transacciones.find({
            $or: [
                { idFromUsuario: cuenta._id },
                { idToUsuario: cuenta._id }
            ]
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            transacciones
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener transacciones'
        });
    }
};


/* =========================================
   🔵 TRANSACCIONES RECIBIDAS
========================================= */
export const obtenerTransaccionesRecibidas = async (req, res) => {
    try {

        const { numeroCuenta } = req.params;

        const cuenta = await Cuentas.findOne({ numeroCuenta });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        if (cuenta.usuarioId.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver estas transacciones'
            });
        }

        const transacciones = await Transacciones.find({
            idToUsuario: cuenta._id
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            transacciones
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener transacciones recibidas'
        });
    }
};


/* =========================================
   🔴 TRANSACCIONES ENVIADAS
========================================= */
export const obtenerTransaccionesEnviadas = async (req, res) => {
    try {

        const { numeroCuenta } = req.params;

        const cuenta = await Cuentas.findOne({ numeroCuenta });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        if (cuenta.usuarioId.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver estas transacciones'
            });
        }

        const transacciones = await Transacciones.find({
            idFromUsuario: cuenta._id
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            transacciones
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener transacciones enviadas'
        });
    }
};