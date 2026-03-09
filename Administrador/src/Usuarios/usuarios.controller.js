import Usuario from './usuarios.model.js'


// Obtener todos los usuarios con paginación y filtros
export const getUsuarios = async (req, res) => {
    try{
        const {page = 1, limit = 10, isActive = true} = req.query;
        const filter = {isActive}
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };
        
        const usuarios = await Usuario.find(filter)
        .limit(limit * 1)
        .skip((page - 1)*limit)
        .sort({createdAt: -1});
        
        const total = await Usuario.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: usuarios,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit,
            },
        });
    }
    catch (error){
        res.status(500).json({
            success: false,
            message: 'Error al obtener los campos',
            error: error.message,
        });
    }
};


// Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id);

        if (!usuario || !usuario.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado o inactivo',
            });
        }

        res.status(200).json({
            success: true,
            data: usuario,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar el usuario',
            error: error.message,
        });
    }
};