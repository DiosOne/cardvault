import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main className="home">
            <section className="hero">
                <h1>CardVault</h1>
                <p>Store and manage your cared collection in one secure place,</p>
                <div className="hero-actions">
                    <Link className="btn primary" to="/register">Create Account</Link>
                    <Link className="btn secondary" to="/login">Log In</Link>
                </div>
            </section>
        </main>
    )
}
