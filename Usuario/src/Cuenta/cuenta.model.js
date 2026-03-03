'use streict';

import mongoose from "mongoose";

const cuentasSchema = new mongoose.Schema({
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es obligatorio'],
        required: true,
        maxlength: [150, 'El nombre completo no puede tener mas 150 caracteres'],
    },
    documentoIdentidad: {
        type: String,
        required: [true, 'El documento de identidad es obligatorio'],
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio'],
        required: true,
        trim: true,
        minlength: [8, 'El teléfono debe tener al menos 8 dígitos'],
    },
    correo: {
        type: String,
        required: true,
        trim: true,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    tipoCuenta: {
        type: String,
        required: [true, 'El tipo de cuenta es obligatorio'],
        required: true,
        maxlength: [50, 'El tipo de cuenta no puede tener mas 50 caracteres'],
    },
    numeroCuenta: {
        type: String,
        required: [true, 'El número de cuenta es obligatorio'],
        required: true,
        unique: true,
        trim: true,
    },
    saldo: {
        type: Number,
        required: [true, 'El saldo es obligatorio'],
        required: true,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})
cuentasSchema.index({ isActive: 1 });

export default mongoose.model('Cuentas', cuentasSchema);
