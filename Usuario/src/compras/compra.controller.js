import Compras from './compras.model.js';
import Cuentas from '../cuenta/cuenta.model.js';
import Producto from '../Productos/productos.model.js';

export const crearCompra = async (req, res) => {
    try {

        const { producto, descripcion, cantidad, precioNormal, precioMejor } = req.body;

        if (!producto || !cantidad || !precioNormal || !precioMejor) {
            return res.status(400).json({
                success: false,
                message: 'Producto, cantidad y precios son obligatorios'
            });
        }

        if (cantidad <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        if (precioMejor > precioNormal) {
            return res.status(400).json({
                success: false,
                message: 'El precio mejor no puede ser mayor al precio normal'
            });
        }

        // Buscar cuenta del usuario logueado
        const cuenta = await Cuentas.findOne({ usuario: req.uid });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        if (!cuenta.isActive) {
            return res.status(400).json({
                success: false,
                message: 'La cuenta está inactiva'
            });
        }

        // Verificar que el producto exista
        const productoDB = await Producto.findById(producto);

        if (!productoDB) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Calcular total
        const total = cantidad * precioMejor;

        if (cuenta.saldo < total) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente'
            });
        }

        // Descontar saldo
        cuenta.saldo -= total;
        await cuenta.save();

        // Crear compra
        const nuevaCompra = new Compras({
            cuenta: cuenta._id,
            producto,
            descripcion: descripcion || productoDB.nombre,
            cantidad,
            precioNormal,
            precioMejor
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

        const cuenta = await Cuentas.findOne({ usuario: req.uid });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada'
            });
        }

        const compras = await Compras.find({ cuenta: cuenta._id })
            .populate('producto', 'nombre precio')
            .populate('cuenta', 'numeroCuenta nombreCompleto')
            .sort({ fechaSolicitud: -1 });

        return res.status(200).json({
            success: true,
            compras
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener compras'
        });
    }
};