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
        const match= typeof authHeader === "string"
            ? authHeader.match(/^Bearer\\s+(.+)$/i)
            : null;

        if (!match) {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        //Split "Bearer <token>" to isolate the JWT payload.
        const token= match[1].trim();
        if (!token) {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }
        const decoded= jwt.verify(token, process.env.JWT_SECRET);

        req.user= decoded; //available as req.user.id
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.status(403).json({message: MESSAGES.TOKEN_INVALID});
    }
};
