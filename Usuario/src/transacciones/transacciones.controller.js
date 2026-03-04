'use strict';

import Transacciones from './transacciones.model.js';
import Cuentas from '../cuenta/cuenta.model.js';

export const crearTransaccion = async (req, res) => {
    try {

        const { numeroCuentaOrigen } = req.params;
        const { numeroCuentaDestino, amount, description, type } = req.body;

        // 🔎 Validaciones básicas
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

        // 🔎 Buscar cuentas
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

        // 🔐 Validar que la cuenta sea del usuario autenticado
        if (cuentaOrigen.usuario.toString() !== req.uid) {
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

        // 💸 Actualizar saldos
        cuentaOrigen.saldo -= amount;
        cuentaDestino.saldo += amount;

        await cuentaOrigen.save();
        await cuentaDestino.save();

        // 📝 Guardar transacción con números de cuenta
        const nuevaTransaccion = new Transacciones({
            numeroCuentaOrigen,
            numeroCuentaDestino,
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

export const obtenerMisTransacciones = async (req, res) => {
    try {

        const cuentasUsuario = await Cuentas.find({ usuario: req.uid });

        if (!cuentasUsuario.length) {
            return res.status(404).json({
                success: false,
                message: 'No tienes cuentas registradas'
            });
        }

        const numerosCuenta = cuentasUsuario.map(c => c.numeroCuenta);

        const transacciones = await Transacciones.find({
            $or: [
                { numeroCuentaOrigen: { $in: numerosCuenta } },
                { numeroCuentaDestino: { $in: numerosCuenta } }
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