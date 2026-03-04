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
            .skip((page - 1) * limit)
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las transacciones',
            error: error.message,
        });
    }
};

export const getTransaccionByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!year) {
            return res.status(400).json({
                success: false,
                message: 'El año es requerido (ej: /transacciones/2008)',
            });
        }

        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const transacciones = await Transacciones.find({
            date: { $gte: startDate, $lte: endDate }
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ date: -1 });

        const total = await Transacciones.countDocuments({
            date: { $gte: startDate, $lte: endDate }
        });

        res.status(200).json({
            success: true,
            message: `Transacciones del año ${year} obtenidas exitosamente`,
            data: transacciones,
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
            message: 'Error al obtener las transacciones por año',
            error: error.message,
        });
    }
};

export const getTransaccionByMonth = async (req, res) => {
    try {
        const { year, month } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'El año y mes son requeridos (ej: /transacciones/2008/12)',
            });
        }

        const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setMilliseconds(-1);

        const transacciones = await Transacciones.find({
            date: { $gte: startDate, $lt: endDate }
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ date: -1 });

        const total = await Transacciones.countDocuments({
            date: { $gte: startDate, $lt: endDate }
        });

        res.status(200).json({
            success: true,
            message: `Transacciones del mes ${month}/${year} obtenidas exitosamente`,
            data: transacciones,
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
            message: 'Error al obtener las transacciones por mes',
            error: error.message,
        });
    }
};
