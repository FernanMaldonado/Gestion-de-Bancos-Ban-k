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

// Crear un retiro y restar del saldo
export const crearRetiro = async (req, res) => {
    try {
        const { cuentaId, amount, account_number } = req.body;

        if (!cuentaId || !amount || !account_number) {
            return res.status(400).json({
                success: false,
                message: 'Cuenta, monto y número de cuenta son obligatorios'
            });
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El monto debe ser un número mayor a 0'
            });
        }

        // Buscar la cuenta
        const cuenta = await mongoose.model('Cuentas').findById(cuentaId);

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        // Verificar saldo suficiente
        if (cuenta.saldo < amount) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente'
            });
        }

        // Restar el monto del saldo
        cuenta.saldo -= amount;
        await cuenta.save();

        // Guardar el retiro
        const retiro = new Retiro({
            cuentaId: cuenta._id,
            account_number,
            amount
        });

        await retiro.save();

        return res.status(201).json({
            success: true,
            message: 'Retiro realizado y saldo actualizado correctamente',
            retiro
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear el retiro',
            error: error.message
        });
    }
};