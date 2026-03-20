const getClass = (score: number) => {
    if (score >= 70) return "hi";
    if (score >= 50) return "md";
    return "lo";
};

const getLabel = (score: number) => {
    if (score >= 70) return "Strong Match";
    if (score >= 50) return "Partial Match";
    return "Weak Match";
};

interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
    const cls = getClass(score);
    const label = getLabel(score);

    return (
        <div className="dark-score-card">
            <div className="dark-score-card-header">
                <div>
                    <div className="dark-score-label">ATS Score</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                        <div className={`dark-score-number ${cls}`}>{score}</div>
                        <div className="dark-score-total">/ 100</div>
                    </div>
                </div>
                <div className={`dark-status-pill ${cls}`}>{label}</div>
            </div>
            <div className="dark-progress-bar">
                <div className={`dark-progress-fill ${cls}`} style={{ width: `${score}%` }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {suggestions.map((s, i) => (
                    <div key={i} className="dark-tip-row">
                        <div className={`dark-tip-dot ${s.type === "good" ? "good" : "warn"}`} />
                        <div className="dark-tip-text">{s.tip}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ATS;