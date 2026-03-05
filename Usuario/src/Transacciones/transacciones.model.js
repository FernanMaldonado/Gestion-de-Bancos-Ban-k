'use strict';

import mongoose, { mongo } from 'mongoose';

const TransaccionesSchema = new mongoose.Schema({
    idFromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        required: true
    },
    idToAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
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
        required: false,
        default: 'sin descripción'
    }
});

export default mongoose.model('Transacciones', TransaccionesSchema);