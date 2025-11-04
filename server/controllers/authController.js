import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login= async (req, res) => {
    try {
        const {email, password}= req.body;
        
        //find by email
        const user= await User.findOne({email});
        if (!user) return res.status(400).json({message: "User not found."});
        
        //check PW
        const isMatch= await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid password."});

        //generate jwt token
        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        //return token and info
        res.status(200).json({token, user});
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({message: "Server error", error: err.message});
    }
};