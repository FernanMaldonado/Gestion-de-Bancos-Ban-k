import Cuentas from './cuenta.model.js';
import Usuarios from '../usuarios/usuarios.model.js';

// Obtener todas las cuentas con paginación y filtros
export const getCuentas = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive = true } = req.query;

    const filter = { isActive };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const cuentas = await Cuentas.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(options.sort);

    const total = await Cuentas.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: cuentas,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las cuentas',
      error: error.message,
    });
  }
};

// Obtener cuenta por ID
export const getCuentaById = async (req, res) => {
  try {
    const { id } = req.params;

    const cuenta = await Cuentas.findById(id);
    const usuario = await Usuarios.findById(cuenta.usuarioId);

    if (!cuenta) {
      return res.status(404).json({
        success: false,
        message: 'Cuenta no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: { cuenta, usuario: usuario.name },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cuenta',
      error: error.message,
    });
  }
};

// Obtener una cuenta por id de usuario
export const getCuentaByUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const usuario = await Usuarios.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const cuentas = await Cuentas.find({ usuarioId: usuario._id });

    if (!cuentas || cuentas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron cuentas para el usuario',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: { cuentas, usuario: usuario.name },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cuenta',
      error: error.message,
    });
  }
}

// Crear nueva cuenta
export const createCuenta = async (req, res) => {
  try {
    const cuentaData = req.body;

    // Generar un número de cuenta único y aleatorio de 10 a 12 dígitos
    cuentaData.numeroCuenta = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const cuenta = new Cuentas(cuentaData);
    await cuenta.save();

    res.status(201).json({
      success: true,
      message: 'Cuenta creada exitosamente',
      data: cuenta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la cuenta',
      error: error.message,
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
