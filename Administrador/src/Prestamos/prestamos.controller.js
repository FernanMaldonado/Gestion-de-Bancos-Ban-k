import mongoose from 'mongoose';
import Prestamos from './prestamos.model.js';

// Listar todos los préstamos
export const getPrestamos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const prestamos = await Prestamos.find()
      .populate('cuentaId', 'numeroCuenta tipoCuenta usuarioId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fecha: -1 });

    const total = await Prestamos.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Préstamos obtenidos exitosamente',
      data: prestamos,
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
      message: 'Error al obtener préstamos',
      error: error.message,
    });
  }
};

// Listar préstamos pendientes
export const getPrestamosPendientes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { estado: 'pendiente' };

    const prestamos = await Prestamos.find(filter)
      .populate('cuentaId', 'numeroCuenta tipoCuenta usuarioId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fecha: -1 });

    const total = await Prestamos.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Préstamos pendientes obtenidos exitosamente',
      data: prestamos,
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
      message: 'Error al obtener préstamos pendientes',
      error: error.message,
    });
  }
};

// Obtener préstamo por ID
export const getPrestamoById = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamos.findById(id);
    if (!prestamo) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado',
      });
    }
    res.status(200).json({ success: true, data: prestamo });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el préstamo',
      error: error.message,
    });
  }
};

// Obtener préstamos por id de cuenta
export const getPrestamosByCuenta = async (req, res) => {
  try {
    const { numeroCuenta } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const cuenta = await mongoose.model('Cuentas').findOne({ numeroCuenta });
    if (!cuenta) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la cuenta con el número ${numeroCuenta}`
      });
    }

    const filter = { cuentaId: cuenta._id };

    const prestamos = await Prestamos.find(filter)
      .populate('cuentaId', 'numeroCuenta tipoCuenta')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fecha: -1 });

    if (!prestamos.length) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron préstamos para la cuenta',
        data: [],
      });
    }

    const total = await Prestamos.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Préstamos de la cuenta obtenidos exitosamente',
      data: prestamos,
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
      message: 'Error al obtener préstamos por cuenta',
      error: error.message,
    });
  }
};

// Cambiar estado de préstamo (aprobar o rechazar)
export const changePrestamoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const action = req.url.includes('/aprobar') ? 'aprobado' : 'rechazado';

    const prestamo = await Prestamos.findByIdAndUpdate(
      id,
      { estado: action },
      { new: true }
    );

    if (!prestamo) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: `Préstamo ${action} exitosamente`,
      data: prestamo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del préstamo',
      error: error.message,
    });
  }
};
