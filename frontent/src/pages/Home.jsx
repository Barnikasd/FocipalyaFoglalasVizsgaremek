import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import './Home.css';

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get('/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Hiba a userek lekérésekor:", err);
        if (err.response?.status === 403) {
          setError("Titkosított zóna: Csak Adminisztrátorok láthatják a felhasználókat!");
        } else {
          setError("Jelentkezz be az adatok megtekintéséhez!");
        }
        setLoading(false);
      });
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Biztosan véglegesen törölni akarod ezt a felhasználót?")) return;
    
    try {
      await api.delete(`/users/${userId}`);
      toast.success("Felhasználó sikeresen törölve!");
      setUsers(users.filter(user => user.id !== userId)); 
    } catch (err) {
      console.error("Hiba a törlés során:", err);
      toast.error(err.response?.data?.message || "❌ Hiba a törlés során! (Lehet, hogy van már foglalása?)");
    }
  };

  return (
    <div className="home-container">
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">A tökéletes meccs itt kezdődik.</h1>
          <p className="hero-subtitle">
            Foglald le a legjobb minőségű sportpályákat másodpercek alatt. 
            Nincs több telefonálgatás, csak tiszta játékidő.
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Miért válassz minket?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Villámgyors foglalás</h3>
            <p>Csak pár kattintás, és már tiéd is a pálya. Valós idejű naptár és azonnali visszaigazolás.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏟️</div>
            <h3>Prémium pályák</h3>
            <p>Fedett és szabadtéri műfüves, illetve füves pályák, folyamatosan karbantartva a maximális élményért.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobilra szabva</h3>
            <p>Bárhol is vagy, a telefonodról is kényelmesen kezelheted a foglalásaidat és adataidat.</p>
          </div>
        </div>
      </section>

      <section className="admin-users-section">
        <h2 className="section-title">👥 Rendszer Felhasználók (Admin Panel)</h2>
        
        <div className="users-container">
          {loading && <p className="loading-text">Felhasználók betöltése...</p>}
          
          {error && (
            <div className="secure-warning">
              <span className="lock-icon">🔒</span> {error}
            </div>
          )}

          {!loading && !error && (
            users.length === 0 ? (
              <p style={{textAlign: 'center'}}>Nincsenek felhasználók a rendszerben...</p>
            ) : (
              <div className="premium-table-wrapper">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email cím</th>
                      <th>Szerepkör</th>
                      {/* ÚJ OSZLOP */}
                      <th>Műveletek</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="user-id">#{user.id}</td>
                        <td className="user-email">{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role === 'ADMIN' ? 'admin-badge' : 'user-badge'}`}>
                            {user.role || 'USER'}
                          </span>
                        </td>
                        {/* ÚJ GOMB */}
                        <td style={{textAlign: 'center'}}>
                          {user.role !== 'ADMIN' && (
                            <button 
                              onClick={() => handleDeleteUser(user.id)} 
                              style={{
                                padding: '6px 12px', 
                                backgroundColor: '#ff4d4f', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = '#d9363e'}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
                            >
                              Törlés 🗑️
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </section>

    </div>
  );
}

export default Home;