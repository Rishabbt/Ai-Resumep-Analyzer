import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar bg-slate-500 ">
            <Link to="/">
                <p className="text-sm font-bold text-white md:text-2xl  text-gradient   ">RESUMIND</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
