import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Rezoom | Review' },
    { name: 'description', content: 'Detailed overview of your application' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv, puterReady } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!puterReady) return;
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, puterReady]);

    useEffect(() => {
        if (!puterReady) return;
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;
            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            setResumeUrl(URL.createObjectURL(new Blob([resumeBlob], { type: 'application/pdf' })));

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            setImageUrl(URL.createObjectURL(imageBlob));

            setFeedback(data.feedback);
        }
        loadResume();
    }, [id, puterReady]);

    return (
        <main className="dark-page" style={{ paddingTop: 0 }}>
            <div className="dark-topbar">
                <Link to="/" className="dark-logo">
                    <span className="dark-logo-dot" />
                    rezoom
                </Link>
                <Link to="/" className="dark-result-back">
                    ← Dashboard
                </Link>
            </div>

            {!feedback ? (
                <div className="dark-scanning">
                    <img src="/images/resume-scan-2.gif" style={{ width: 180, opacity: 0.7 }} alt="scanning" />
                    <span className="dark-status-text">analyzing resume...</span>
                </div>
            ) : (
                <div className="dark-result-layout">
                    <div className="dark-result-left">
                        {imageUrl && resumeUrl ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <div className="dark-resume-preview-wrap">
                                        <img src={imageUrl} alt="resume" />
                                    </div>
                                </a>
                                <span style={{ fontSize: "11px", color: "var(--dark-faint)", fontFamily: "'Geist Mono', monospace" }}>
                                    click to open PDF
                                </span>
                            </div>
                        ) : (
                            <div style={{ width: 160, height: 210, background: "var(--dark-surface)", borderRadius: 6, border: "1px solid var(--dark-border)" }} />
                        )}
                    </div>
                    <div className="dark-result-right">
                        <Summary feedback={feedback} />
                        <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                        <Details feedback={feedback} />
                    </div>
                </div>
            )}
        </main>
    );
}

export default Resume;