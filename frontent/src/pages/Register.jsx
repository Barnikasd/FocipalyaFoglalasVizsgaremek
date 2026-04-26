import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import './Login.css'; 
function Register() {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      
      await api.post('/users/register', {
        name: name,
        email: email,
        passwordHash: password 
      });

     
      toast.success('Sikeres regisztráció! Most már bejelentkezhetsz.');
      
     
      navigate('/login');

    } catch (err) {
      console.error("Regisztrációs hiba:", err);
      
      
      if (err.response?.status === 409 || err.response?.status === 400) {
        toast.error('Hiba! Lehet, hogy ez az e-mail cím már foglalt.');
      } else {
        toast.error('Hiba történt a regisztráció során! Ellenőrizd a szervert.');
      }
    }
  };

  return (
    <div className="login-page">
      
      <div className="login-card">
        <h2>Regisztráció</h2>

        <form onSubmit={handleRegister}>
          
          <div className="input-group">
            <label>Teljes név:</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pl. Kiss József"
            />
          </div>

          <div className="input-group">
            <label>E-mail cím:</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pelda@email.hu"
            />
          </div>

          <div className="input-group">
            <label>Jelszó:</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 karakter"
              minLength="6"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '15px' }}>
            Fiók létrehozása
          </button>
        </form>

        <div className="login-footer">
          Már van fiókod? <Link to="/login">Jelentkezz be!</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;