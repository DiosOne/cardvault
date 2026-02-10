import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { MESSAGES } from "../utility/messages.js";

/**
 * Authenticate a user and return a JWT plus user details.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const login= async (req, res) => {
    try {
        const {email, password}= req.body;

        //if blank
        if (!email || !password) {
          return res.status(400).json({message: MESSAGES.MISSING_DATA});
        }
        
        //find by email
        const user= await User.findOne({email});
        if (!user) return res.status(400).json({message: MESSAGES.INVALID_LOGIN});
        
        //check PW
        const isMatch= await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: MESSAGES.INVALID_LOGIN});

        //generate jwt token
        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        //return token and info
        res.status(200).json({
          message: MESSAGES.LOGIN_SUCCESS,
          token,
          user,
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({message: MESSAGES.SERVER_ERROR});
    }
};
