import Cuentas from './cuenta.model.js';

// Obtener cuentas del usuario logueado
export const getMisCuentas = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const filter = {
            usuarioId: req.uid,
            isActive: true
        };

        const cuentas = await Cuentas.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Cuentas.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: cuentas,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit),
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las cuentas del usuario',
            error: error.message,
        });
    }
};

// Obtener cuenta por ID
export const getCuentaById = async (req, res) => {
    try {
        const { id } = req.params;

        const cuenta = await Cuentas.findById(id);

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            data: cuenta,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la cuenta',
            error: error.message,
        });
    }
};

// Crear nueva cuenta
export const createCuenta = async (req, res) => {
    try {
        const { usuario, tipoCuenta } = req.body;

        // 1️⃣ Validación: verificar si el usuario ya tiene este tipo de cuenta
        const cuentaExistente = await Cuentas.findOne({
            usuarioId: usuario,
            tipoCuenta: tipoCuenta.toUpperCase() // asegurar mayúsculas
        });

        if (cuentaExistente) {
            return res.status(400).json({
                success: false,
                message: `El usuario ya tiene una cuenta de tipo ${tipoCuenta}`
            });
        }

        // 3️⃣ Crear la cuenta
        const cuentaData = {
            ...req.body,
            usuarioId: usuario,
            tipoCuenta: tipoCuenta.toUpperCase()
        };

        const cuenta = new Cuentas(cuentaData);
        await cuenta.save();

        // 4️⃣ Responder éxito
        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            data: cuenta
        });

    } catch (error) {
        // Manejo de errores de duplicado u otros
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe un registro con este valor para ${field}`
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al crear la cuenta',
            error: error.message
        });
    }
};

// Actualizar cuenta
export const updateCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        const cuenta = await Cuentas.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cuenta actualizada exitosamente',
            data: cuenta,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la cuenta',
            error: error.message,
        });
    }
};

// Cambiar estado de la cuenta (activar/desactivar)
export const changeCuentaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const isActive = req.url.includes('/activar');
        const action = isActive ? 'activada' : 'desactivada';

        const cuenta = await Cuentas.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!cuenta) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            message: `Cuenta ${action} exitosamente`,
            data: cuenta,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado de la cuenta',
            error: error.message,
        });
    }
};