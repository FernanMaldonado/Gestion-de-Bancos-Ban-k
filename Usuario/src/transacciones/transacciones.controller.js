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

        // 🔎 Buscar cuenta origen por número
        const cuentaOrigen = await Cuentas.findOne({ numeroCuenta: numeroCuentaOrigen });

        if (!cuentaOrigen) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta origen no encontrada'
            });
        }

        // 🔐 Validar que la cuenta pertenezca al usuario del token
        if (cuentaOrigen.usuario.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para usar esta cuenta'
            });
        }

        if (!cuentaOrigen.isActive) {
            return res.status(400).json({
                success: false,
                message: 'La cuenta origen está inactiva'
            });
        }

        // 🔎 Buscar cuenta destino
        const cuentaDestino = await Cuentas.findOne({ numeroCuenta: numeroCuentaDestino });

        if (!cuentaDestino) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta destino no encontrada'
            });
        }

        if (!cuentaDestino.isActive) {
            return res.status(400).json({
                success: false,
                message: 'La cuenta destino está inactiva'
            });
        }

        // ❌ Evitar transferencia a la misma cuenta
        if (cuentaOrigen._id.toString() === cuentaDestino._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'No puedes transferirte a la misma cuenta'
            });
        }

        // 💰 Validar saldo
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

        // 📝 Crear registro de transacción
        const nuevaTransaccion = new Transacciones({
            idFromUsuario: cuentaOrigen._id,
            idToUsuario: cuentaDestino._id,
            amount,
            description: description || 'Sin descripción',
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

        const cuentasUsuario = await Cuentas.find({ usuario: req.uid });

        if (!cuentasUsuario.length) {
            return res.status(404).json({
                success: false,
                message: 'No tienes cuentas registradas'
            });
        }

        const cuentasIds = cuentasUsuario.map(c => c._id);

        const transacciones = await Transacciones.find({
            $or: [
                { idFromUsuario: { $in: cuentasIds } },
                { idToUsuario: { $in: cuentasIds } }
            ]
        })
            .populate('idFromUsuario', 'numeroCuenta nombreCompleto')
            .populate('idToUsuario', 'numeroCuenta nombreCompleto')
            .sort({ createdAt: -1 });

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