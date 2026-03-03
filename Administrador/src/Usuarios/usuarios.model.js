'user strict';

import mongoose, {mongo} from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dpi: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    job_name: {
        type: String,
        required: true
    },
    monthly_income: {
        type: Number,
        required: true
    },
    birthdate: {
        type: Date,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

UsuarioSchema.index({ isActive: 1 })
export default mongoose.model('Usuario', UsuarioSchema);