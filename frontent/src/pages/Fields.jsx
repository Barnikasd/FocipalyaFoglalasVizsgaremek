import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import api from '../api/axiosConfig';
import './Fields.css';

function Fields() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  // ÚJ: Állapot az óraszámnak (alapértelmezetten 1 óra)
  const [duration, setDuration] = useState(1);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  useEffect(() => {
    api.get('/fields')
      .then(response => setFields(response.data))
      .catch(error => console.error("Hiba a pályák betöltésekor:", error));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    const [date, time] = bookingDate.split('T');

    try {
      await api.post('/reservations', {
        field: { id: selectedField.id }, 
        date: date,
        startTime: time,
     
        durationHours: Number(duration) 
      });

      toast.success('✅ Sikeres foglalás! Nézd meg a Foglalásaim menüben.');
      setSelectedField(null);
      setBookingDate('');
      setDuration(1); 
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`❌ ${err.response.data.message}`);
      } else {
        toast.error('❌ Hiba történt. Lehet, hogy már foglalt az időpont?');
      }
    }
  };

  return (
    <div className="fields-page">
      <h2 style={{ textAlign: 'center', margin: '20px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
        🏟️ Elérhető Sportpályák
      </h2>

      {fields.length === 0 ? (
        <p className="loading-text">Jelenleg nincsenek elérhető pályák a rendszerben...</p>
      ) : (
        <div className="fields-grid">
          {fields.map(field => (
            <div key={field.id} className="field-card">
              <div className="field-icon">{field.covered ? "🏠" : "☀️"}</div>
              <h3>{field.name}</h3>
              <p className="sport-type">{field.sportType}</p>
              <div className="field-info">
                <span>💰 {field.pricePerHour} Ft / óra</span>
                <span>📍 {field.covered ? "Fedett" : "Szabadtéri"}</span>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => setSelectedField(field)}
              >
                Pálya lefoglalása
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedField && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '10px', color: 'var(--text-color)' }}>
              Foglalás: {selectedField.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
              Típus: {selectedField.sportType}
            </p>
            
            <form onSubmit={handleBooking}>
              <div className="input-group">
                <label>Válassz dátumot és időpontot:</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={minDateTime}
                />
              </div>

         
              <div className="input-group">
                <label>Időtartam (óra):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="4" 
                  required 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

             
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                background: 'rgba(212, 175, 55, 0.05)', 
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '4px', 
                textAlign: 'center' 
              }}>
                <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                  Várható végösszeg
                </strong> 
                <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem', fontWeight: '800', margin: '10px 0 5px 0' }}>
                  {selectedField.pricePerHour * duration} Ft
                </div>
              </div>

              <div className="modal-buttons">
                
                <button type="submit" className="btn-primary">Megerősítés</button>
                <button type="button" className="btn-cancel" onClick={() => setSelectedField(null)}>Mégse</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fields;