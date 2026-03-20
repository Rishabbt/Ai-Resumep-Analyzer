import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Rezoom" },
        { name: "description", content: "AI-powered resume analysis & ATS scoring" },
    ];
}

export default function Home() {
    const { auth, kv, puterReady } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if (!puterReady) return;
        if (!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated, puterReady]);

    useEffect(() => {
        if (!puterReady || !auth.isAuthenticated) return;
        const load = async () => {
            setLoadingResumes(true);
            const items = (await kv.list("resume:*", true)) as KVItem[];
            const parsed = items?.map((r) => JSON.parse(r.value) as Resume) ?? [];
            setResumes(parsed);
            setLoadingResumes(false);
        };
        load();
    }, [puterReady, auth.isAuthenticated]);

    return (
        <main className="dark-page" style={{ paddingTop: 0 }}>
            <Navbar />
            <div className="dark-home-body">
                {loadingResumes ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: "16px" }}>
                        <img src="/images/resume-scan-2.gif" style={{ width: 120, opacity: 0.6 }} alt="loading" />
                        <span style={{ fontSize: "13px", color: "var(--dark-faint)", fontFamily: "'Geist Mono', monospace" }}>
                            loading resumes...
                        </span>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="dark-empty-state">
                        <div style={{ width: 48, height: 48, background: "var(--dark-surface)", border: "1px solid var(--dark-border-2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 2v6h6M12 18v-6M9 15h6" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="dark-empty-title">No resumes yet</div>
                        <div className="dark-empty-sub">
                            Upload your first resume to get an ATS score and AI-powered feedback.
                        </div>
                        <Link to="/upload" className="dark-primary-btn">
                            Analyze your first resume →
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="dark-section-head">
                            <div>
                                <div className="dark-section-title">Your Resumes</div>
                                <div className="dark-section-sub">{resumes.length} analyzed</div>
                            </div>
                            <Link to="/upload" className="dark-cta-btn">
                                <span style={{ fontSize: "16px", color: "var(--accent-blue)", lineHeight: "1" }}>+</span>
                                Analyze New
                            </Link>
                        </div>
                        <div className="dark-resume-grid">
                            {resumes.map((resume) => (
                                <ResumeCard key={resume.id} resume={resume} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}