import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import About from './components/About';
import Contact from './components/Contact';
import IndividualProfile from './components/IndividualProfile';
import CorporateProfile from './components/CorporateProfile';
import Navbar from './components/Navbar';
import Fields from './components/Fields';
import PitchDetailPage from './components/PitchDetailPage';
import UserReservationsPage from './components/UserReservationsPage';
import './styles.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home'); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(''); 
    const [username, setUsername] = useState('');
    const onNavigate = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUsername = localStorage.getItem('username');
    if (storedLoggedIn) {
        setIsLoggedIn(JSON.parse(storedLoggedIn));
        setUserRole(storedUserRole || '');
        setUsername(storedUsername || '');
    }
}, []);
const handleLogin = (role, username) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUsername(username);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', username);
    setCurrentPage('home');
};
const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setCurrentPage('home');
};
const renderPage = () => {
    if (!isLoggedIn && (currentPage === 'corporateProfile' || currentPage === 'individualProfile')) {
        return <h1>Lütfen giriş yapın</h1>;
    }
    if (currentPage === 'home') return <Home onNavigate={onNavigate} isLoggedIn={isLoggedIn}/>;
    if (currentPage === 'register') return <Register onNavigate={onNavigate} />;
    if (currentPage === 'login') return <Login onLoginSuccess={handleLogin} onNavigate={onNavigate}/>;
    if (currentPage === 'about') return <About />;
    if (currentPage === 'contact' && userRole !== 'admin') return <Contact />;
    if (currentPage === 'adminPanel' && userRole === 'admin') return <AdminPanel username={username} />;
    if (currentPage === 'individualProfile' && userRole === 'bireysel') return <IndividualProfile username={username} />;
    if (currentPage === 'corporateProfile' && userRole === 'kurumsal') return <CorporateProfile username={username} />;
    if (currentPage === 'userReservations' && userRole === 'bireysel') {
        return <UserReservationsPage username={username} />;
    }    
    if (currentPage === 'fields' && userRole === 'kurumsal') {
        return <Fields username={username}/>;
    }
    if (currentPage.startsWith('pitchDetail-')) {
        const pitchId = currentPage.split('-')[1];
        return <PitchDetailPage pitchId={pitchId} username={username} />;
    }
    return <h1>404 - Sayfa Bulunamadı</h1>;
};
    return (
        <div>
            {/* Navbar */}
            <Navbar
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                onNavigate={(page) => setCurrentPage(page)}
                onLogout={handleLogout}
            />

            {/* Sayfa İçeriği */}
            <div>{renderPage()}</div>
        </div>
    );
}

export default App;
