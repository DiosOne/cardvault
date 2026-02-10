import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * Schema for application users.
 * @type {mongoose.Schema}
 */
const userSchema= new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            uniquue: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "Minimum password length is 6 characters."],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

/**
 * Hash the user's password before saving if it changed.
 * @this {import("mongoose").Document & { password: string, isModified: (path: string) => boolean }}
 * @param {Function} next
 * @returns {Promise<void>}
 */
const hashPasswordBeforeSave= async function (next) {
    if (!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password, 10);
    next();
};

//hash PW before saving
userSchema.pre('save', hashPasswordBeforeSave);

/**
 * Compare a plaintext password with the stored hash.
 * @this {import("mongoose").Document & { password: string }}
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
const comparePassword= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//compare PW method for login
userSchema.methods.comparePassword= comparePassword;

/**
 * User model for authentication and ownership lookups.
 * @type {mongoose.Model}
 */
const User= mongoose.model('User', userSchema);
export default User;
