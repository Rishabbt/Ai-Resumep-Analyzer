const getScoreClass = (score: number) => {
    if (score >= 70) return "hi";
    if (score >= 50) return "md";
    return "lo";
};

const getScoreLabel = (score: number) => {
    if (score >= 70) return "Strong";
    if (score >= 50) return "Average";
    return "Needs Work";
};

const CategoryRow = ({ title, score }: { title: string; score: number }) => {
    const cls = getScoreClass(score);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--dark-muted)" }}>{title}</span>
                <span className={`dark-mini-score ${cls === "hi" ? "dark-score-hi" : cls === "md" ? "dark-score-md" : "dark-score-lo"}`}
                    style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                    {score}
                </span>
            </div>
            <div className="dark-progress-bar" style={{ marginBottom: 0 }}>
                <div className={`dark-progress-fill ${cls}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const cls = getScoreClass(feedback.overallScore);
    const label = getScoreLabel(feedback.overallScore);

    return (
        <div className="dark-score-card">
            <div className="dark-score-card-header">
                <div>
                    <div className="dark-score-label">Overall Score</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                        <div className={`dark-score-number ${cls}`}>{feedback.overallScore}</div>
                        <div className="dark-score-total">/ 100</div>
                    </div>
                </div>
                <div className={`dark-status-pill ${cls}`}>{label}</div>
            </div>
            <div className="dark-progress-bar">
                <div className={`dark-progress-fill ${cls}`} style={{ width: `${feedback.overallScore}%` }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <CategoryRow title="Tone & Style" score={feedback.toneAndStyle.score} />
                <CategoryRow title="Content" score={feedback.content.score} />
                <CategoryRow title="Structure" score={feedback.structure.score} />
                <CategoryRow title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    );
};

export default Summary;