import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Hoppá! Ez a pálya nem létezik.</h2>
      <p className="not-found-text">
        Úgy tűnik, lesre futottál! A keresett oldal nem található vagy elköltözött.
      </p>
      <Link to="/" className="btn-home">
        Vissza a kezdőrúgáshoz ⚽
      </Link>
    </div>
  );
}

export default NotFound;