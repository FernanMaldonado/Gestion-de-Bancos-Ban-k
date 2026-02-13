export const validateLogin = (req, res, next) => {
    const { name, password } = req.body;

    const errors = [];

    if (!name) {
        errors.push({
            field: 'name',
            message: 'El nombre es obligatorio'
        });
    }

    if (!password) {
        errors.push({
            field: 'password',
            message: 'La contraseña es obligatoria'
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'error validation',
            error: errors
        });
    }

    next();
};
