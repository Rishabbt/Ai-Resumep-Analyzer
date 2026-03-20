import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const getScoreClass = (score: number) => {
    if (score >= 70) return "dark-score-hi";
    if (score >= 50) return "dark-score-md";
    return "dark-score-lo";
};

const ThumbPlaceholder = () => (
    <div className="dark-card-thumb-placeholder">
        <div className="dark-thumb-line accent" />
        <div style={{ height: 4 }} />
        <div className="dark-thumb-line full" />
        <div className="dark-thumb-line three-q" />
        <div className="dark-thumb-line half" />
        <div style={{ height: 3 }} />
        <div className="dark-thumb-line full" />
        <div className="dark-thumb-line three-q" />
        <div className="dark-thumb-line half" />
        <div className="dark-thumb-line full" />
    </div>
);

const ResumeCard = ({
    resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
    resume: Resume;
}) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        const load = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;
            setResumeUrl(URL.createObjectURL(blob));
        };
        load();
    }, [imagePath]);

    const atsScore = feedback?.ATS?.score ?? feedback?.overallScore ?? 0;
    const scoreClass = getScoreClass(atsScore);

    return (
        <Link to={`/resume/${id}`} className="dark-resume-card">
            <div className="dark-card-thumb">
                {resumeUrl ? (
                    <img src={resumeUrl} alt="resume preview" />
                ) : (
                    <ThumbPlaceholder />
                )}
            </div>
            <div className="dark-card-body">
                <div>
                    <div className="dark-card-company">
                        {companyName || "No company"}
                    </div>
                    <div className="dark-card-role">
                        {jobTitle || "Untitled Resume"}
                    </div>
                </div>
                <div className="dark-card-footer">
                    <span className={`dark-score-badge ${scoreClass}`}>
                        ATS {atsScore}
                    </span>
                    <span className="dark-card-date">
                        {new Date().toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                        })}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;