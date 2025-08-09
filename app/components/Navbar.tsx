import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar bg-slate-500 ">
            <Link to="/">
                <p className="text-sm font-bold text-black md:text-2xl  text-gradient underline underline-offset-1 decoration-white  ">Rezoom</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
