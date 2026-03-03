import Cuentas from "../cuenta/cuenta.model.js";
import Transacciones from "./transacciones.model.js";

export const getTransacciones = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { date: -1 },
        };

        const transacciones = await Transacciones.find()
            .limit(limit * 1)
            .skip((page-1)*limit)
            .sort(options.sort);

        const total = await Transacciones.countDocuments();

        res.status(200).json({
            success: true,
            message: 'Transacciones obtenidas exitosamente',
            data: transacciones,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit,
            },
        });
    } catch ( error ) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las transacciones',
            error: error.message,
        });
    }
};


// Logica para realizar una transacción entre dos cuentas y actualizar los saldos de ambas cuentas de manera atómica utilizando transacciones de MongoDB
export const transaction = async (req, res) => {
    try {
        const { idFromUsuario, idToUsuario, amount, description} = req.body;

        if ( !idFromUsuario || !idToUsuario || !amount ) {
            throw new Error('Faltan datos para realizar la transacción');
        }

        // Encontrar la cuenta de origen y destino dentro de la transacción. Si alguna de las cuentas no existe, se lanzará un error y se abortará la transacción
        const fromCuenta = await Cuentas.findById(idFromUsuario);
        if (!fromCuenta) {
            throw new Error('Cuenta de origen no encontrada');
        }

        if(fromCuenta.saldo < amount) {
            throw new Error('Saldo insuficiente en la cuenta de origen');
        }

        const toCuenta = await Cuentas.findById(idToUsuario);
        if (!toCuenta) {
            throw new Error('Cuenta de destino no encontrada');
        }

        fromCuenta.saldo -= amount;
        toCuenta.saldo += amount;

        await fromCuenta.save();
        await toCuenta.save();

        const nuevaTransaccion = new Transacciones({
            idFromUsuario,
            idToUsuario,
            amount,
            description: description || 'sin descripción',
        });
        
        await nuevaTransaccion.save();

        res.status(200).json({
            success: true,
            message: 'Transacción realizada exitosamente',
                data: {
                    fromCuenta: {
                        numeroCuenta: fromCuenta.numeroCuenta,
                        saldo: fromCuenta.saldo
                    },
                    toCuenta: {
                        numeroCuenta: toCuenta.numeroCuenta,
                        saldo: toCuenta.saldo
                    }
                }
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al realizar la transacción',
            error: error.message,
        });
    }
};