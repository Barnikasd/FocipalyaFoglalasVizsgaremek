package hu.nyirszikszi.sport_backend.controller;

import hu.nyirszikszi.sport_backend.model.Reservation;
import hu.nyirszikszi.sport_backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/all")
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {

        String currentUser = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        reservation.setCustomerName(currentUser);

        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalTime now = java.time.LocalTime.now();

        if (reservation.getDate().isBefore(today)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nem foglalhatsz a múltba!");
        }

        if (reservation.getDate().isEqual(today)) {
            java.time.LocalTime requestedTime = java.time.LocalTime.parse(reservation.getStartTime());
            if (requestedTime.isBefore(now)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ez az időpont ma már elmúlt!");
            }
        }

        Long incomingFieldId = reservation.getField().getId();

        boolean isTaken = reservationRepository.existsByFieldIdAndDateAndStartTime(
                incomingFieldId,
                reservation.getDate(),
                reservation.getStartTime()
        );

        if (isTaken) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A pálya ebben az időpontban már foglalt!");
        }

        return reservationRepository.save(reservation);
    }


    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
    }

    @GetMapping("/my")
    public List<Reservation> getMyReservations() {
        String currentUser = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();

        return reservationRepository.findAll().stream()
                .filter(res -> res.getCustomerName() != null && res.getCustomerName().equals(currentUser))
                .collect(java.util.stream.Collectors.toList());
    }
}