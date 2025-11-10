import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate= useNavigate();

    const handleSubmit= async (e) => {
        e.preventDefault();
        try {
            const res= await API.post("/auth/register", {
                username,
                email,
                password,
            });
            alert(res.data.message || "Registration successful!");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
            console.error("register error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Register</button>

            <p>
                Already have an account?{" "}
                <Link to="/login">Log in here</Link>
            </p>            
        </form>
    );
}