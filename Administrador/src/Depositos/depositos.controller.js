'use strict';

import mongoose from 'mongoose';
import Depositos from './depositos.model.js';

// Obtener todos los depósitos
export const getDepositos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const depositos = await Depositos.find()
      .populate('cuentaId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Depositos.countDocuments();

    res.status(200).json({
      success: true,
      data: depositos,
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
      message: 'Error al obtener los depósitos',
      error: error.message,
    });
  }
};

// Obtener depósitos por idcuenta
export const getDepositosByCuenta = async (req, res) => {
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

    const depositos = await Depositos.find({ cuentaId: cuenta._id })
      .populate('cuentaId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Depositos.countDocuments({ cuentaId: cuenta._id });

    if (!depositos || depositos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron depósitos para esta cuenta',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: depositos,
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
      message: 'Error al obtener los depósitos de la cuenta',
      error: error.message,
    });
  }
};
