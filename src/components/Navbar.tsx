import { Link } from 'react-router-dom';
import { Newspaper, LogIn, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedLogin = localStorage.getItem('hn_logged_in') === 'true';
        setIsLoggedIn(savedLogin);
    }, []);

    const handleToggleLogin = () => {
        const newState = !isLoggedIn;
        localStorage.setItem('hn_logged_in', String(newState));
        setIsLoggedIn(newState);
        if (!newState) {
            window.location.reload(); // Reset state on logout
        }
    };

    return (
        <nav className="navbar glass-panel">
            <div className="navbar-content">
                <Link to="/" className="brand">
                    <div className="logo-box">
                        <Newspaper size={20} color="white" />
                    </div>
                    <span>Wormhole</span>
                </Link>

                <div className="nav-actions">
                    {isLoggedIn ? (
                        <div className="user-group">
                            <button className="user-profile">
                                <User size={18} />
                                <span>Demo User</span>
                            </button>
                            <button className="logout-btn action-btn" onClick={handleToggleLogin} title="Logout">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button className="login-btn" onClick={handleToggleLogin}>
                            <LogIn size={16} />
                            <span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
