import BlacklistedToken from "./blacklist.model.js";

export const logout = async (req, res) => {
    try {

        const token = req.header("x-token");

        await new BlacklistedToken({ token }).save();

        return res.status(200).json({
            success: true,
            message: "Sesión cerrada e invalidada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al cerrar sesión",
            error: error.message
        });
    }
};