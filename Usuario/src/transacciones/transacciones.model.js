'use strict';

import mongoose from 'mongoose';

const TransaccionesSchema = new mongoose.Schema({

    numeroCuentaOrigen: {
        type: String,
        required: true
    },

    numeroCuentaDestino: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    type: {
        type: String,
        enum: ['transferencia', 'pago', 'recarga'],
        default: 'transferencia',
        required: true
    },

    description: {
        type: String,
        default: 'sin descripción'
    }

});

export default mongoose.model('Transacciones', TransaccionesSchema);