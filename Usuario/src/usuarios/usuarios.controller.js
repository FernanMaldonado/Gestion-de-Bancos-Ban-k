import Usuario from './usuarios.model.js'

export const getUsuarioLogueado = async (req, res) => {
    try {

        const usuario = await Usuario.findById(req.uid);

        if (!usuario || !usuario.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado o inactivo'
            });
        }

        res.status(200).json({
            success: true,
            data: usuario
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario logueado',
            error: error.message
        });
    }
};

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

export const createUsuario = async (req, res) => {
    try {

        const usuarioData = req.body;

        const usuario = new Usuario(usuarioData);
        await usuario.save();

        res.status(201).json({
            success: true,
            message: 'Campo creado correctamente',
            data: usuario,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'No se pudo agregar el usuario',
            error: error.message,
        });
    }
};


export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const usuario = await Usuario.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: usuario,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message,
        });
    }
};


export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByIdAndUpdate(id, { isActive: false }, { new: true });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario desactivado correctamente',
            data: usuario,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al desactivar el usuario',
            error: error.message,
        });
    }
};