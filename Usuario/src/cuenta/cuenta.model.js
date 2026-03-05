'use strict';

import mongoose from "mongoose";

const cuentasSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es obligatorio'],
        maxlength: [150, 'El nombre completo no puede tener más de 150 caracteres'],
        trim: true
    },
    documentoIdentidad: {
        type: String,
        required: [true, 'El documento de identidad es obligatorio'],
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio'],
        trim: true,
        minlength: [8, 'El teléfono debe tener al menos 8 dígitos']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        trim: true,
        lowercase: true
    },
    tipoCuenta: {
        type: String,
        required: [true, 'El tipo de cuenta es obligatorio'],
        enum: ['MONETARIA', 'AHORRO', 'EMPRESARIAL'],
        uppercase: true
    },
    numeroCuenta: {
        type: String,
        required: [true, 'El número de cuenta es obligatorio'],
        unique: true,
        trim: true
    },
    saldo: {
        type: Number,
        default: 0,
        min: [0, 'El saldo no puede ser negativo']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

cuentasSchema.index({ usuario: 1, tipoCuenta: 1 }, { unique: true });

cuentasSchema.index({ isActive: 1 });

export default mongoose.model('Cuentas', cuentasSchema);