'use streict';

import mongoose from "mongoose";

const cuentasSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tipoCuenta: {
        type: String,
        required: [true, 'El tipo de cuenta es obligatorio'],
        required: true,
        maxlength: [50, 'El tipo de cuenta no puede tener mas 50 caracteres'],
    },
    numeroCuenta: {
        type: String,
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

const Cuenta = mongoose.models.Cuenta || mongoose.model('Cuenta', cuentasSchema);

export default Cuenta;