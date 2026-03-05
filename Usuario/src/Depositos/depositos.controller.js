'use strict';

import mongoose from 'mongoose';
import Depositos from './depositos.model.js';
import Cuentas from '../cuenta/cuenta.model.js'; // tu modelo de cuentas se llama "Cuenta"

// ======================================================
// OBTENER TODOS LOS DEPÓSITOS DE UN USUARIO (TODAS SUS CUENTAS)
// ======================================================
export const getMisDepositos = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Obtener todas las cuentas del usuario
        const cuentasUsuario = await Cuentas.find({ usuario: req.uid });
        if (!cuentasUsuario.length) {
            return res.status(404).json({
                success: false,
                message: 'No tienes cuentas registradas'
            });
        }

        const cuentasIds = cuentasUsuario.map(c => c._id);

        // Buscar todos los depósitos desde esas cuentas
        const depositos = await Depositos.find({ cuentaId: { $in: cuentasIds } })
            .populate('cuentaId', 'numeroCuenta tipoCuenta usuario')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ date: -1 });

        const total = await Depositos.countDocuments({ cuentaId: { $in: cuentasIds } });

        res.status(200).json({
            success: true,
            data: depositos,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalRecords: total,
                limit: Number(limit),
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener depósitos del usuario',
            error: error.message,
        });
    }
};

// ======================================================
// OBTENER DEPÓSITOS DE UNA CUENTA ESPECÍFICA
// ======================================================
export const getMisDepositosPorCuenta = async (req, res) => {
    try {
        const { numeroCuenta } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Buscar la cuenta y verificar que pertenezca al usuario
        const cuenta = await Cuentas.findOne({ numeroCuenta, usuario: req.uid });
        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: `No se encontró la cuenta con el número ${numeroCuenta} para este usuario`
            });
        }

        // Buscar depósitos realizados desde esa cuenta
        const depositos = await Depositos.find({ cuentaId: cuenta._id })
            .populate('cuentaId', 'numeroCuenta tipoCuenta usuario')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ date: -1 });

        const total = await Depositos.countDocuments({ cuentaId: cuenta._id });

        res.status(200).json({
            success: true,
            message: `Depósitos de la cuenta ${numeroCuenta} obtenidos correctamente`,
            data: depositos,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalRecords: total,
                limit: Number(limit),
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los depósitos por cuenta',
            error: error.message,
        });
    }
};

// ======================================================
// CREAR UN DEPÓSITO
// ======================================================
export const crearDeposito = async (req, res) => {
    try {
        const { cuentaId, account_number, amount } = req.body;

        // Validaciones básicas
        if (!cuentaId || !account_number || !amount) {
            return res.status(400).json({
                success: false,
                message: 'cuentaId, account_number y amount son obligatorios'
            });
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El monto debe ser un número mayor a 0'
            });
        }

        // Verificar que la cuenta de origen pertenezca al usuario
        const cuenta = await Cuentas.findOne({ _id: cuentaId, usuario: req.uid });
        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la cuenta de origen o no pertenece al usuario'
            });
        }

        // Verificar que la cuenta destino exista
        const cuentaDestino = await Cuentas.findOne({ numeroCuenta: account_number });
        if (!cuentaDestino) {
            return res.status(404).json({
                success: false,
                message: `La cuenta destino ${account_number} no existe`
            });
        }

        // Validar saldo suficiente
        if (cuenta.saldo < amount) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente para realizar el depósito'
            });
        }

        // Restar del saldo de la cuenta origen
        cuenta.saldo -= Number(amount);
        await cuenta.save();

        // Crear el depósito
        const deposito = new Depositos({
            cuentaId: cuenta._id,
            account_number,
            amount: Number(amount)
        });

        await deposito.save();

        // Agregar saldo a la cuenta destino
        cuentaDestino.saldo += Number(amount);
        await cuentaDestino.save();

        res.status(201).json({
            success: true,
            message: `Depósito de Q${amount} realizado a la cuenta ${account_number} correctamente`,
            data: deposito
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al realizar el depósito',
            error: error.message
        });
    }
};