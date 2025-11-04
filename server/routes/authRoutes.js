import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router= express.Router();

//register
router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;

        //basic validation
        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields must be completed."});
        }

        //check for user
        const existingUser= await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already registered."});
        }
        //create new
        const user= new User({username, email, password});
        await user.save();

        res.status(201).json({message: "User registerd successfully."});
        } catch (error) {
            console.error("Register error:", error.message);
            res.status(500).json({message: "Server error during registration."});
        }
});

//login
router.post("/login", async (req,res) => {
    try {
        const {email, password}= req.body;

        //basic validation
        if (!email || !password) {
            return res.status(400).json({message: "All fields must be completed."});
        }

        //check user exists
        const user= await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        //create JWT token
        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1hr",
        });

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }catch (error) {
        console.error("Login error", error.message);
        res.status(500).json({message: "Server error during login."});
    }
});

export default router;