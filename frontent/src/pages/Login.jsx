import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import api from '../api/axiosConfig';
import './Login.css'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', {
        email: username,
        passwordHash: password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      toast.success('Sikeres bejelentkezés! Üdvözlünk!');
      
      navigate('/fields');
      window.location.reload(); 

    } catch (err) {
      console.error("Login error:", err);
      toast.error('Hibás e-mail cím vagy jelszó!');
    }
  };

  return (
    
    <div className="login-page">
      
      
      <div className="login-card">
        <h2>Bejelentkezés</h2>

        <form onSubmit={handleLogin}>
          
         
          <div className="input-group">
            <label>E-mail cím:</label>
            <input 
              type="email" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="********"
            />
          </div>

          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Belépés
          </button>
        </form>

        
        <div className="login-footer">
          Nincs még fiókod? <Link to="/register">Regisztrálj itt!</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;