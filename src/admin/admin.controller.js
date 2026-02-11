import Admin from './admin.model.js';

// Obtener admins (paginado)
export const getAdmins = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = 'active' } = req.query;

        const filter = { status };

        const admins = await Admin.find(filter)
            .limit(parseInt(limit))
            .skip((page - 1) * limit)
            .sort({ creationDate: -1 });

        const total = await Admin.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: admins,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: limit
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener administradores',
            error: error.message
        });
    }
};


// Crear admin
export const createAdmin = async (req, res) => {
    try {
        const adminData = req.body;

        if (!adminData.name || !adminData.email || !adminData.password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y password son obligatorios'
            });
        }

        const admin = new Admin(adminData);
        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Administrador creado exitosamente',
            data: admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el administrador',
            error: error.message
        });
    }
};


// Obtener admin por ID
export const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener administrador',
            error: error.message
        });
    }
};


// Actualizar admin
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        const admin = await Admin.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Administrador actualizado',
            data: admin
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar',
            error: error.message
        });
    }
};


// Activar / Desactivar admin
export const changeAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const status = req.url.includes('/activate') ? 'active' : 'inactive';

        const admin = await Admin.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: `Administrador ${status === 'active' ? 'activado' : 'desactivado'}`,
            data: admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar estado',
            error: error.message
        });
    }
};
