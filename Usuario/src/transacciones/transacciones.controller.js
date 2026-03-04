'use strict';

import Transacciones from './transacciones.model.js';
import Cuentas from '../cuenta/cuenta.model.js';

export const crearTransaccion = async (req, res) => {
    try {

        const { idToUsuario, amount, description, type } = req.body;

        if (!idToUsuario || !amount) {
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

        const cuentaOrigen = await Cuentas.findOne({ usuario: req.uid });

        if (!cuentaOrigen) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta del usuario no encontrada'
            });
        }

        const cuentaDestino = await Cuentas.findById(idToUsuario);

        if (!cuentaDestino) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta destino no encontrada'
            });
        }

        if (cuentaOrigen._id.toString() === cuentaDestino._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'No puedes transferirte a tu propia cuenta'
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
            description: description || 'sin descripción',
            type: type || 'transferencia'
        });

        await nuevaTransaccion.save();

        return res.status(201).json({
            success: true,
            message: 'Transferencia realizada correctamente',
            transaccion: nuevaTransaccion
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const obtenerMisTransacciones = async (req, res) => {
    try {

        const cuenta = await Cuentas.findOne({ usuario: req.uid });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        const transacciones = await Transacciones.find({
            $or: [
                { idFromUsuario: cuenta._id },
                { idToUsuario: cuenta._id }
            ]
        })
            .populate('idFromUsuario', 'numeroCuenta nombreCompleto')
            .populate('idToUsuario', 'numeroCuenta nombreCompleto')
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            transacciones
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener transacciones'
        });
    }
};