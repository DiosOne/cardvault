import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate= useNavigate();

    const handleSubmit= async (e) => {
        e.preventDefault();
        try {
            const res= await API.post("/auth/login", {email, password});
            login(res.data);
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
}
