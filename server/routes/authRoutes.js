import express from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { MESSAGES } from "../utility/messages.js";

dotenv.config();
const router= express.Router();
const authLimiter= rateLimit({
    windowMs: 60_000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Handle user registration requests.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
const handleRegister= async (req, res) => {
    try {
        const {username, email, password} = req.body;

        //basic validation
        if (!username || !email || !password) {
          return res.status(400).json({message: MESSAGES.MISSING_DATA});
        }

        //check for user
        const existingUser= await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already registered."});
        }
        //create new
        const user= new User({username, email, password});
        await user.save();

        res.status(201).json({message: MESSAGES.REGISTER_SUCCESS});
      } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({message: MESSAGES.REGISTER_ERROR});
      }
};

//register
router.post('/register', authLimiter, handleRegister);

/**
 * Handle user login and JWT issuance.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
const handleLogin= async (req,res) => {
    try {
        const {email, password}= req.body;

        //basic validation
        if (!email || !password) {
            return res.status(400).json({message: MESSAGES.MISSING_DATA});
        }

        //check user exists
        const user= await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: MESSAGES.INVALID_LOGIN});
        }

        //check for correct password
        const isMatch= await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({message: MESSAGES.INVALID_LOGIN});
        }

        //create JWT token
        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1hr",
        });

        res.status(200).json({
            message: MESSAGES.LOGIN_SUCCESS,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }catch (error) {
        console.error("Login error", error.message);
        res.status(500).json({message: MESSAGES.SERVER_ERROR});
    }
};

//login
router.post("/login", authLimiter, handleLogin);

export default router;
