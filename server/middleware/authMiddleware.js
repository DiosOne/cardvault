import { MESSAGES } from "../utility/messages.js";
import { expressjwt } from "express-jwt";

/**
 * Verify JWT from the Authorization header and attach user payload to the request.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const jwtMiddleware= expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "user",
    getToken: (req) => {
        const authHeader= req.headers.authorization;
        if (typeof authHeader !== "string") return null;

        const trimmedHeader= authHeader.trim();
        if (trimmedHeader.length > 4096) return null;

        const spaceIndex= trimmedHeader.indexOf(" ");
        if (spaceIndex === -1) return null;

        const scheme= trimmedHeader.slice(0, spaceIndex).toLowerCase();
        if (scheme !== "bearer") return null;

        const token= trimmedHeader.slice(spaceIndex + 1).trim();
        return token || null;
    },
});

export const verifyToken= (req, res, next) => {
    jwtMiddleware(req, res, (err) => {
        if (!err) {
            return next();
        }

        if (err.code === "credentials_required") {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        if (err.code === "invalid_token") {
            return res.status(403).json({message: MESSAGES.TOKEN_INVALID});
        }

        return next(err);
    });
};
