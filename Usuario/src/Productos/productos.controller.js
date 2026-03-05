import Productos from './productos.model.js';

// Obtener todos los productos con paginación y filtro por estado
export const getProductos = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const filter = { isActive };

        const productos = await Productos.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ fecha_creacion: -1 });

        const total = await Productos.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: productos,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message,
        });
    }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Productos.findById(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
        }

        return res.status(200).json({
            success: true,
            data: producto,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            error: error.message,
        });
    }
};

// Crear nuevo producto
export const createProducto = async (req, res) => {
    try {
        const productoData = req.body;
        const producto = new Productos(productoData);
        await producto.save();

        return res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: producto,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message,
        });
    }
};