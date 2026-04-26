import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Fields from './pages/Fields';
import MyBookings from './pages/MyBookings';
import AdminFields from './pages/AdminFields';
import NotFound from './pages/NotFound';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
 
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
    <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      <div className="container">
        <header>
          <h1>Sportpálya Foglaló</h1>
          
          <nav>
            <Link to="/">Főoldal</Link>
            <Link to="/fields">Pályák</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/my-bookings">Foglalásaim</Link>
                
              
                {userRole === 'ADMIN' && (
                  <Link to="/admin/fields" className="admin-nav-link">
                    + Új Pálya (Admin)
                  </Link>
                )}

                <button onClick={handleLogout} className="btn-logout">
                  Kijelentkezés
                </button>
              </>
            ) : (
              <>
                <Link to="/register">Regisztráció</Link>
                <Link to="/login">Bejelentkezés</Link>
              </>
            )}
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/fields" element={<Fields />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            
           
            <Route path="/admin/fields" element={<AdminFields />} />

            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer>
          <p>© 2026 Sportpálya Foglaló Rendszer - Minden jog fenntartva</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;