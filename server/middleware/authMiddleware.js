import jwt from "jsonwebtoken";
import { MESSAGES } from "../utility/messages.js";

/**
 * Verify JWT from the Authorization header and attach user payload to the request.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export const verifyToken= (req, res, next) => {
    try {
        const authHeader= req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        //Split "Bearer <token>" to isolate the JWT payload.
        const token= authHeader.split(" ")[1];
        const decoded= jwt.verify(token, process.env.JWT_SECRET);

        req.user= decoded; //available as req.user.id
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.status(403).json({message: MESSAGES.TOKEN_INVALID});
    }
}
