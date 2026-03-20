import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'Rezoom | Sign In' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    return (
        <main className="dark-page" style={{ paddingTop: 0 }}>
            <div className="dark-topbar">
                <div className="dark-logo">
                    <span className="dark-logo-dot" />
                    rezoom
                </div>
            </div>
            <div className="dark-auth-body">
                <div className="dark-auth-card">
                    <div className="dark-auth-logo">
                        <span className="dark-logo-dot" />
                        rezoom
                    </div>
                    <div className="dark-auth-sub">
                        AI-powered resume analysis<br />& ATS scoring
                    </div>
                    <div className="dark-auth-divider" />

                    {isLoading ? (
                        <div className="dark-auth-loading">
                            <div className="dark-auth-spinner" />
                            signing you in...
                        </div>
                    ) : (
                        <>
                            {auth.isAuthenticated ? (
                                <button
                                    className="dark-puter-btn"
                                    onClick={auth.signOut}
                                >
                                    <div className="dark-puter-logo">P</div>
                                    Sign Out
                                </button>
                            ) : (
                                <button
                                    className="dark-puter-btn"
                                    onClick={auth.signIn}
                                >
                                    <div className="dark-puter-logo">P</div>
                                    Continue with Puter
                                </button>
                            )}
                        </>
                    )}

                    <div className="dark-auth-note">
                        Your data is stored privately in your Puter account.<br />
                        No passwords. No tracking.
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Auth;