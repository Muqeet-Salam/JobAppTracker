import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpg";

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="logo-container">
                <img src={Logo} alt="JT" />
                <h2>Job Application Tracker </h2>
            </div>
            <nav>
                <ul className="nav">
                    <li>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/view" className="nav-link">
                            View
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="nav-link">
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
