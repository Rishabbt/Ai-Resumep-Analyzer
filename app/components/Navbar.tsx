import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
    const { auth } = usePuterStore();
    const initials = auth.user?.username
        ? auth.user.username.slice(0, 2).toUpperCase()
        : "??";

    return (
        <div className="dark-topbar">
            <Link to="/" className="dark-logo">
                <span  />
                Rezoom
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* <Link to="/upload" className="dark-cta-btn">
                    <span style={{ fontSize: "16px", color: "var(--accent-blue)", lineHeight: "1" }}>+</span>
                    Analyze New
                </Link> */}
                {auth.isAuthenticated && (
                    <div className="dark-user-dot" title={auth.user?.username}>
                        {initials}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;