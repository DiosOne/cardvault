import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
            minlength: [6, "Minimum password length is 6 characters."]
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

//hash PW before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password, 10);
    next();
});

//compare PW method for login
userSchema.methods.comparePassword= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User= mongoose.model('User', userSchema);
export default User;