import React, { useState, useEffect } from "react";
import "../style/interviewreprt.scss";
import { useInterview } from "../hooks/useinterview";
import { useParams,useNavigate } from "react-router-dom";

const InterviewReport = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { loading, report, fetchReportById,getResumePdf } = useInterview();
    const [activeTab, setActiveTab] = useState("technical");
  

    useEffect(() => {
        if (interviewId) {
            fetchReportById(interviewId);
        }
    }, [interviewId, fetchReportById]);




    if (loading) {
        return (
            <main className="loading-container">
                <h1>Loading Report Details.........</h1>
            </main>
        );
    }

    // Agar loading khatam ho jaye aur report na mile
    if (!report) {
        return (
            <main className="loading-container">
                <h1>No report data found.</h1>
            </main>
        );
    }



    const gapPercent = report.matchScore;

    const renderContent = () => {
    const data =
        activeTab === "technical"
            ? report.technicalQuestions
            : activeTab === "behavioral"
            ? report.behavioralQuestions
            : report.preparationPlan;

    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    if (activeTab === "roadmap") {
        return report.preparationPlan.map((item, i) => (
            <div key={i} className="card roadmap-card">

                <div className="roadmap-header">
                    <div className="day-badge">Day {item.day}</div>
                    <div className="focus">{item.focus}</div>
                </div>

                <div className="ai-summary">
                    Focus: {item.focus}
                </div>

                <div className="task-box">
                    <div className="task-title">Tasks</div>

                    {Array.isArray(item.tasks) &&
                        item.tasks.map((task, idx) => (
                            <div key={idx} className="task-item">
                                ✅ {task}
                            </div>
                        ))}
                </div>

            </div>
        ));
    }

    return data.map((item, i) => {
        if (!item.question || !item.answer) return null;

        return (
            <div key={i} className="card">

                <div style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#fff" }}>
                        Q{i + 1}: {item.question}
                    </strong>
                </div>

                <div style={{ marginBottom: "6px", fontSize: "0.85rem" }}>
                    <span style={{ color: "#a78bfa", fontWeight: "600" }}>
                        Intention:
                    </span>{" "}
                    <span style={{ color: "#9ca3af" }}>
                        {item.intention}
                    </span>
                </div>

                <div style={{ fontSize: "0.85rem" }}>
                    <span style={{ color: "#22c55e", fontWeight: "600" }}>
                        Model Answer:
                    </span>{" "}
                    <span style={{ color: "#d1d5db" }}>
                        {item.answer}
                    </span>
                </div>

            </div>
        );
    });
};


    return (
        <main className="report-container">

            {/* LEFT NAV */}
            <aside className="nav">
                <button className="back-btn" onClick={() => navigate("/interview")}>
                    ← Back to Dashboard
                </button>
                <h2>Report</h2>

                <button
                    className={activeTab === "technical" ? "active" : ""}
                    onClick={() => setActiveTab("technical")}
                >
                    Technical
                </button>

                <button
                    className={activeTab === "behavioral" ? "active" : ""}
                    onClick={() => setActiveTab("behavioral")}
                >
                    Behavioral
                </button>

                <button
                    className={activeTab === "roadmap" ? "active" : ""}
                    onClick={() => setActiveTab("roadmap")}
                >
                    Roadmap
                </button>

                <button className="download-btn" onClick={() => getResumePdf(interviewId)} >
                    Download Resume 
                </button>
            </aside>

            {/* CENTER */}
            <section className="main">
                <div className="header">
                    <h1>
                        {activeTab === "technical" && "Technical Questions"}
                        {activeTab === "behavioral" && "Behavioral Insights"}
                        {activeTab === "roadmap" && "Preparation Roadmap"}
                    </h1>
                    <p>AI generated personalized interview guidance</p>
                </div>

                <div className="content">{renderContent()}</div>
            </section>

            {/* RIGHT */}

            {/* ✅ RIGHT SIDEBAR FIXED */}
            <aside className="skills">

                <h2>Skill Gaps</h2>

                {/* CIRCLE */}
                <div
                    className="circle"
                    style={{ "--percent": gapPercent }}
                >
                    <div className="inner">
                        <h3 >{gapPercent}%</h3>
                        <p>Gap Level</p>
                    </div>
                </div>

                {/* LIST */}
                <div className="list">
                    {report.skillGaps.map((gap, i) => (
                        <span key={i} className="skill">
                            {gap.skill}
                        </span>
                    ))}
                </div>

            </aside>


        </main>
    );
};

export default InterviewReport;