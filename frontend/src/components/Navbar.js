import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Navbar.css'; 

const Navbar = ({ isLoggedIn, userRole, onLogout, onNavigate }) => {
    return (
        <nav className="navbar">
            <div className="logo" onClick={() => onNavigate('home')}>
                Sahaburadan
            </div>
            <ul className="navbar-links">
                <li className="navbar-link" onClick={() => onNavigate('home')}>
                    Anasayfa
                </li>
                {!isLoggedIn && (
                    <>
                        <li className="navbar-link" onClick={() => onNavigate('register')}>
                            Kaydol
                        </li>
                        <li className="navbar-link" onClick={() => onNavigate('login')}>
                            Giriş Yap
                        </li>
                    </>
                )}
                {isLoggedIn && userRole === 'bireysel' && (
                    <>
                        <li className="navbar-link" onClick={() => onNavigate('individualProfile')}>
                            Profilim
                        </li>
                        <li className="navbar-link" onClick={() => onNavigate('userReservations')}>
                            Rezervasyonlarım
                        </li>
                    </>
                )}
                {isLoggedIn && userRole === 'kurumsal' && (
                    <>
                        <li className="navbar-link" onClick={() => onNavigate('corporateProfile')}>
                            Profilim
                        </li>
                        <li className="navbar-link" onClick={() => onNavigate('fields')}>
                            Sahalarım
                        </li>
                    </>
                )}
                {isLoggedIn && userRole === 'admin' && (
                    <li className="navbar-link" onClick={() => onNavigate('adminPanel')}>
                        Admin Panel
                    </li>
                )}
                    {!isLoggedIn || userRole !== 'admin' ? (
                    <li className= "navbar-link" onClick={() => onNavigate('contact')}>İletişim</li>
                ) : null}
                {isLoggedIn && (
                    <li className="navbar-link" onClick={onLogout}>
                        Çıkış Yap
                    </li>
                )}
            </ul>
        </nav>
    );
};

Navbar.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    userRole: PropTypes.string,
    onLogout: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
    isLoggedIn: false,
    userRole: '',
    onLogout: () => {},
    onNavigate: () => {},
};

export default Navbar;
