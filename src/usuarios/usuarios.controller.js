import Usuario from './usuarios.model.js'

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

export const createUsuario = async (req, res) => {
    try{

        const usuarioData = req.body;

        const usuario = new Usuario(usuarioData);
        await usuario.save();

        res.status(201).json({
            success: true,
            message: 'Campo creado correctamente',
            data: usuario,
        });
    }
    catch (error){
        res.status(500).json({
            success: false,
            message: 'No se pudo agregar el usuario',
            error: error.message,
        });
    }
};