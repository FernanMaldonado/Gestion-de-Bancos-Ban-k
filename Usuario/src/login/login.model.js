'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'El nombre de usuario es requerido'],
            trim: true,
            unique: true,
        },

        password: {
            type: String,
            required: [true, 'La contraseña es requerida'],
            minLength: [6, 'La contraseña debe tener mínimo 6 caracteres'],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.index({ username: 1 });
userSchema.index({ isActive: 1 });

export default mongoose.model('User', userSchema);
