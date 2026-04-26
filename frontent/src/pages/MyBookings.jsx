import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import './MyBookings.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/reservations/my');
      setBookings(response.data);
    } catch (err) {
      console.error("Hiba a foglalások lekérésekor:", err);
      toast.error('❌ Nem sikerült betölteni a foglalásokat!');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Biztosan le akarod mondani ezt a foglalást?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      toast.success('🗑️ Foglalás sikeresen lemondva!');
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch (err) {
      console.error("Hiba a lemondáskor:", err);
      toast.error('❌ Nem sikerült lemondani a foglalást.');
    }
  };

  return (
    <div className="bookings-page">
      <h2 className="bookings-title">📅 Közelgő Foglalásaim</h2>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>Még nincs aktív foglalásod. Irány a "Pályák" menüpont, és foglalj egyet!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <span className="booking-date">
                  {new Date(booking.date).toLocaleDateString('hu-HU')}
                </span>
                <span className="booking-time">🕒 {booking.startTime}</span>
              </div>

              <div className="booking-details">
                <p><strong>🏟️ Pálya:</strong> {booking.field?.name}</p>
                <p><strong>⚽ Sportág:</strong> {booking.field?.sportType}</p>
                <p><strong>⏱️ Időtartam:</strong> {booking.durationHours} óra</p>
                <p><strong>💰 Fizetendő:</strong> {booking.field?.pricePerHour * booking.durationHours} Ft</p>
              </div>

              <button className="btn-cancel-booking" onClick={() => handleCancel(booking.id)}>
                Foglalás Lemondása ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;