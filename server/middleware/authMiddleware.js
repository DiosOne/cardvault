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
        if (typeof authHeader !== "string") {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        const trimmedHeader= authHeader.trim();
        if (trimmedHeader.length > 4096) {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        const spaceIndex= trimmedHeader.indexOf(" ");
        if (spaceIndex === -1) {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        const scheme= trimmedHeader.slice(0, spaceIndex).toLowerCase();
        if (scheme !== "bearer") {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        //Split "Bearer <token>" to isolate the JWT payload.
        const token= trimmedHeader.slice(spaceIndex + 1).trim();
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
