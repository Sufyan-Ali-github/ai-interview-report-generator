import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const navg = useNavigate();
    const { handleRegister, authLoading } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({ username, email, password });
        navg("/interview");
    };

    if (authLoading) {
        return (
            <main className="auth-main">
                <div className="auth-loading">
                    <div className="auth-spinner"></div>
                    <p>Creating your account...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="auth-main">
            <div className="auth-card">

                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                            <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="#6366f1" strokeWidth="1.5" fill="rgba(99,102,241,0.15)" />
                            <path d="M14 8L20 11V17L14 20L8 17V11L14 8Z" fill="#6366f1" opacity="0.8" />
                            <circle cx="14" cy="14" r="2.5" fill="#fff" />
                        </svg>
                    </div>
                    <span className="auth-brand-name">InterviewAI</span>
                </div>

                <div className="auth-header">
                    <h1>Create account</h1>
                    <p>Start your AI-powered interview preparation</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="name">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Username
                        </label>
                        <div className="input-wrap">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Choose a username"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Email address
                        </label>
                        <div className="input-wrap">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Password
                        </label>
                        <div className="input-wrap has-toggle">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Create a strong password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-eye"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        <span>Create Account</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </form>

                <p className="auth-footer-text">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">Sign in</Link>
                </p>

            </div>
        </main>
    );
};

export default Register;