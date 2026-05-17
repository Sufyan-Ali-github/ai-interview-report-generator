import React from 'react';
import "../style/home.scss";
import { useInterview } from '../hooks/useinterview';
import { useAuth } from '../../auth/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Home = () => {

    const { loading, generateReport, reports, fetchAllReports } = useInterview();
    const { handleLogout, authLoading, setAuthLoading } = useAuth();
    const navg = useNavigate();

    const resumeInputRef = useRef();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [fileName, setFileName] = useState("");


    useEffect(() => {
        setAuthLoading(false);
        fetchAllReports();
    }, []);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFileName(file.name);
    };

    const handleSubmit = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        const data = await generateReport({ jobDescription, selfDescription, resumeFile });
        const reportId = data._id;
        navg(`/interview/${reportId}`);
    }

    const logoutButton = async () => {
        await handleLogout();
        navg("/login");
    }



    if (loading) {
        return (
            <main className="home">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <h2>Generating your interview plan...</h2>
                    <p>This may take a few moments</p>
                </div>
            </main>
        )
    }




    return (
        <main className="home">
            <div className="container">

                <header className="header">
                    <div className="header-content">
                        <div className="brand">
                            <div className="brand-icon">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="#6366f1" strokeWidth="1.5" fill="rgba(99,102,241,0.1)" />
                                    <path d="M14 8L20 11V17L14 20L8 17V11L14 8Z" fill="#6366f1" opacity="0.7" />
                                    <circle cx="14" cy="14" r="2.5" fill="#fff" />
                                </svg>
                            </div>
                            <div>
                                <h1>InterviewAI</h1>
                                <p>Smart interview preparation powered by AI</p>
                            </div>
                        </div>

                        <button className="logout-btn" onClick={logoutButton} disabled={authLoading}>
                            {authLoading ? (
                                <span className="btn-loading">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </span>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {/* ===== IMPROVED GENERATOR SECTION ===== */}
                <section className="generator-section">
                    <div className="generator-header">
                        <div className="step-badge">
                            <span>Generate Report</span>
                        </div>
                        <h2>Tell us about the opportunity</h2>
                        <p>Fill in the details below and we'll craft a personalized interview strategy for you</p>
                    </div>

                    <div className="generator-grid">

                        {/* Step 1 — Job Description */}
                        <div className="gen-card step-1">
                            <div className="card-header">
                                <div className="step-number">01</div>
                                <div>
                                    <h3>Target Job Description</h3>
                                    <span className="card-hint">Paste the full job posting</span>
                                </div>
                            </div>
                            <div className="textarea-wrapper">
                                <textarea
                                    name="jobdescription"
                                    id="jobDescription"
                                    placeholder="Paste job description here — include role title, responsibilities, and requirements for best results..."
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    value={jobDescription}
                                />
                                <div className="char-indicator">
                                    <span className={jobDescription.length > 0 ? 'active' : ''}>{jobDescription.length} chars</span>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 — Resume + Self Description */}
                        <div className="gen-card step-2">
                            <div className="card-header">
                                <div className="step-number">02</div>
                                <div>
                                    <h3>Your Profile</h3>
                                    <span className="card-hint">Resume & about you</span>
                                </div>
                            </div>

                            {/* Resume Upload */}
                            <div className="upload-zone">
                                <input
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf"
                                    ref={resumeInputRef}
                                    onChange={handleFileChange}
                                    hidden
                                />
                                <label htmlFor="resume" className={`upload-label ${fileName ? 'has-file' : ''}`}>
                                    {fileName ? (
                                        <div className="file-selected">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <div>
                                                <span className="file-name">{fileName}</span>
                                                <span className="file-change">Click to change</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-prompt">
                                            <div className="upload-icon-wrap">
                                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="upload-main">Upload your Resume</span>
                                                <span className="upload-sub">PDF format · Max 10MB</span>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Self Description */}
                            <div className="self-desc-group">
                                <label htmlFor="selfDescription">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                    </svg>
                                    Self Description
                                </label>
                                <textarea
                                    name="selfdescription"
                                    id="selfDescription"
                                    placeholder="Briefly describe your experience, skills, and what makes you a strong candidate..."
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    value={selfDescription}
                                />
                            </div>

                            {/* CTA Button */}
                            <button
                                className="generate-btn"
                                onClick={handleSubmit}
                                disabled={!jobDescription || !selfDescription || !fileName}
                            >
                                <span className="btn-text">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    Generate Interview Report
                                </span>
                                <span className="btn-glow"></span>
                            </button>

                            {(!jobDescription || !selfDescription || !fileName) && (
                                <p className="form-hint">Fill in all fields to generate your report</p>
                            )}
                        </div>
                    </div>
                </section>
                {/* ===== END GENERATOR SECTION ===== */}



                {reports.length > 0 && (
                    <div className="recent-reports">
                        <h2>My Recent Interview Plans</h2>
                        <ul className='reports-lists'>
                            {reports.map((report) => (
                                <li key={report._id} className='report-item' onClick={() => navg(`/interview/${report._id}`)}>
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleString()}</p>
                                    <p className={`match-score`}>Match Score: {report.matchScore}%</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* ===== FOOTER ===== */}
            <footer className="site-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                            <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="#6366f1" strokeWidth="1.5" fill="rgba(99,102,241,0.1)" />
                            <path d="M14 8L20 11V17L14 20L8 17V11L14 8Z" fill="#6366f1" opacity="0.7" />
                            <circle cx="14" cy="14" r="2.5" fill="#fff" />
                        </svg>
                        <span>InterviewAI</span>
                    </div>
                    <p className="footer-copy">© {new Date().getFullYear()} InterviewAI. Built to help you land your dream job.</p>
                    <div className="footer-links">
                        <a href="#">Privacy</a>
                        <span>·</span>
                        <a href="#">Terms</a>
                        <span>·</span>
                        <a href="#">Support</a>
                    </div>
                </div>
            </footer>
            {/* ===== END FOOTER ===== */}

        </main>
    )
}

export default Home;
