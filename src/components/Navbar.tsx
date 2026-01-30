import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar glass-panel">
            <div className="navbar-content">
                <Link to="/" className="brand">
                    <div className="logo-box">
                        <Newspaper size={20} color="white" />
                    </div>
                    <span>Hacker News</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
