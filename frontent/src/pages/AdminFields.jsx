import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import './AdminFields.css'; 

function AdminFields() {
  const [formData, setFormData] = useState({
    name: '', sportType: '', pricePerHour: '', covered: false
  });
  const [fields, setFields] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchFields();
    fetchReservations();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await api.get('/fields');
      setFields(response.data);
    } catch (err) {
      console.error("Hiba a pályák lekérésekor", err);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations/all');
      setReservations(response.data);
    } catch (err) {
      console.error("Hiba a foglalások lekérésekor", err);
    }
  };

  // ÚJ: Foglalás törlése függvény
  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Biztosan törölni akarod ezt a foglalást?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      toast.success('🗑️ Foglalás sikeresen törölve!');
      // Frissítjük a listát a képernyőn
      setReservations(reservations.filter(res => res.id !== id));
    } catch (err) {
      console.error("Törlési hiba:", err);
      toast.error('❌ Hiba a foglalás törlésekor.');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fields', formData);
      toast.success('✅ Új pálya sikeresen hozzáadva!');
      setFormData({ name: '', sportType: '', pricePerHour: '', covered: false });
      fetchFields();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) toast.error('❌ Nincs jogosultságod! (Csak Admin)');
      else toast.error('❌ Hiba történt a mentés során.');
    }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a pályát?')) return;
    try {
      await api.delete(`/fields/${id}`);
      toast.success('🗑️ Pálya sikeresen törölve!');
      setFields(fields.filter(field => field.id !== id));
    } catch (err) {
      toast.error('❌ Hiba a törlés során! (Lehet, hogy van már rá foglalás?)');
    }
  };

  return (
    <div className="admin-fields-container">
      <h2 className="admin-title">🏟️ Új Pálya Rögzítése</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Pálya neve:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Sportág:</label>
          <input type="text" name="sportType" value={formData.sportType} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Óradíj (Ft):</label>
          <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} required />
        </div>
        <div className="checkbox-group">
          <input type="checkbox" name="covered" checked={formData.covered} onChange={handleChange} id="covered-check" />
          <label htmlFor="covered-check">Fedett pálya</label>
        </div>
        <button type="submit" className="btn-submit">Pálya Mentése</button>
      </form>

      <hr className="admin-divider" />

      <h2 className="admin-title">📋 Meglévő Pályák Kezelése</h2>
      <div className="fields-list-container">
        {fields.map(field => (
          <div key={field.id} className="field-list-item">
            <div>
              <strong>{field.name}</strong> ({field.sportType})
            </div>
            <button onClick={() => handleDeleteField(field.id)} className="btn-delete">Törlés 🗑️</button>
          </div>
        ))}
      </div>

      <hr className="admin-divider" />

      <h2 className="admin-title">📅 Összes Foglalás Kezelése</h2>
      {reservations.length === 0 ? (
        <p className="empty-list-text">Még nincsenek foglalások.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Felhasználó</th>
                <th style={{ padding: '10px' }}>Pálya</th>
                <th style={{ padding: '10px' }}>Dátum</th>
                <th style={{ padding: '10px' }}>Művelet</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>#{res.id}</td>
                  <td style={{ padding: '10px' }}>{res.customerName || 'Nincs név'}</td>
                  <td style={{ padding: '10px' }}>{res.field ? res.field.name : 'Törölt pálya'}</td>
                  <td style={{ padding: '10px' }}>{res.date} ({res.startTime})</td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => handleDeleteReservation(res.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Törlés 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminFields;