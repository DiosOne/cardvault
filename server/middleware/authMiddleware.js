import jwt from "jsonwebtoken";
import { MESSAGES } from "../utility/messages.js";

export const verifyToken= (req, res, next) => {
    try {
        const authHeader= req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({message: MESSAGES.TOKEN_MISSING});
        }

        const token= authHeader.split(" ")[1];
        const decoded= jwt.verify(token, process.env.JWT_SECRET);

        req.user= decoded; //available as req.user.id
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.status(403).json({message: MESSAGES.TOKEN_INVALID});
    }
}