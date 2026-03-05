import jwt from "jsonwebtoken";
import BlacklistedToken from "../src/login/blacklist.model.js"

export const validateJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Debes iniciar sesión primero"
        });
    }

    try {

        const blacklisted = await BlacklistedToken.findOne({ token });

        if (blacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token inválido (sesión cerrada)"
            });
        }

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido"
        });
    }
};