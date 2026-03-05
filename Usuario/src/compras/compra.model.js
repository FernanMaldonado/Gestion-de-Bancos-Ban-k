'use strict';

import mongoose from "mongoose";

const comprasSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        required: true
    },

    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        maxlength: [300, 'La descripción no puede tener más de 300 caracteres'],
        trim: true
    },

    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [1, 'La cantidad debe ser mayor a 0']
    },

    precioNormal: {
        type: Number,
        required: [true, 'El precio normal es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },

    precioMejor: {
        type: Number,
        required: [true, 'El precio mejorado es obligatorio'],
        min: [0, 'El precio mejorado no puede ser negativo'],
        validate: {
            validator: function (value) {
                return value <= this.precioNormal;
            },
            message: 'El precio mejorado no puede ser mayor al precio normal'
        }
    },

    fechaSolicitud: {
        type: Date,
        default: Date.now
    },

    isActive: {
        type: Boolean,
        default: true
    }
});

// Índice para producto
comprasSchema.index({ producto: 1 });

// Índice para estado activo
comprasSchema.index({ isActive: 1 });

export default mongoose.model('Compras', comprasSchema);