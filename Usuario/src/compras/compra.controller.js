'use strict';

import Compras from './compra.model.js';
import Cuentas from '../cuenta/cuenta.model.js';
import Producto from '../Productos/productos.model.js';

export const crearCompra = async (req, res) => {
    try {

        const { numeroCuenta, producto, cantidad, precioMejor } = req.body;

        if (!numeroCuenta || !producto || !cantidad) {
            return res.status(400).json({
                success: false,
                message: 'Número de cuenta, producto y cantidad son obligatorios'
            });
        }

        if (isNaN(cantidad)) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser un número válido'
            });
        }

        const cantidadNumero = parseInt(cantidad);

        if (!Number.isInteger(cantidadNumero) || cantidadNumero <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser un número entero mayor a 0'
            });
        }

        const cuenta = await Cuentas.findOne({ numeroCuenta });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        if (cuenta.usuario.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para usar esta cuenta'
            });
        }

        if (!cuenta.isActive) {
            return res.status(400).json({
                success: false,
                message: 'La cuenta está inactiva'
            });
        }

        const productoDB = await Producto.findById(producto);

        if (!productoDB) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        if (!productoDB.isActive) {
            return res.status(400).json({
                success: false,
                message: 'El producto está inactivo'
            });
        }

        // Calcular precios
        const precioNormal = productoDB.precio;
        let precioFinal;

        if (precioMejor) {
            if (isNaN(precioMejor)) {
                return res.status(400).json({
                    success: false,
                    message: 'El precio mejor debe ser un número válido'
                });
            }

            if (precioMejor > precioNormal) {
                return res.status(400).json({
                    success: false,
                    message: 'El precio mejor no puede ser mayor al precio normal'
                });
            }

            precioFinal = Number(precioMejor);
        } else {
            // Aplicar 17% de descuento automáticamente
            precioFinal = precioNormal - (precioNormal * 0.17);
        }

        const total = cantidadNumero * precioFinal;

        if (cuenta.saldo < total) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente'
            });
        }

        cuenta.saldo -= total;
        await cuenta.save();

        const nuevaCompra = new Compras({
            cuenta: cuenta._id,
            producto: productoDB._id,
            descripcion: productoDB.nombre,
            cantidad: cantidadNumero,
            precioNormal,
            precioMejor: precioFinal
        });

        await nuevaCompra.save();

        return res.status(201).json({
            success: true,
            message: 'Compra realizada correctamente',
            total,
            compra: nuevaCompra
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const obtenerMisCompras = async (req, res) => {
    try {

        const cuentasUsuario = await Cuentas.find({ usuario: req.uid });

        if (!cuentasUsuario.length) {
            return res.status(404).json({
                success: false,
                message: 'No tienes cuentas registradas'
            });
        }

        const cuentasIds = cuentasUsuario.map(c => c._id);

        const compras = await Compras.find({ cuenta: { $in: cuentasIds } })
            .populate('producto', 'nombre precio')
            .populate('cuenta', 'numeroCuenta')
            .sort({ fechaSolicitud: -1 });

        return res.status(200).json({
            success: true,
            compras
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener compras'
        });
    }
};

export const obtenerComprasPorCuenta = async (req, res) => {
    try {
        const { numeroCuenta } = req.params;

        if (!numeroCuenta) {
            return res.status(400).json({
                success: false,
                message: 'El número de cuenta es obligatorio'
            });
        }

        const cuenta = await Cuentas.findOne({ numeroCuenta });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        if (cuenta.usuario.toString() !== req.uid) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver las compras de esta cuenta'
            });
        }

        const compras = await Compras.find({ cuenta: cuenta._id })
            .populate('producto', 'nombre precio')
            .populate('cuenta', 'numeroCuenta')
            .sort({ fechaSolicitud: -1 });

        return res.status(200).json({
            success: true,
            compras
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener compras por cuenta'
        });
    }
};