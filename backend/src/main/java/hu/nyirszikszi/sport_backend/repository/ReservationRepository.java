package hu.nyirszikszi.sport_backend.repository;

import hu.nyirszikszi.sport_backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    boolean existsByFieldIdAndDateAndStartTime(Long fieldId, LocalDate date, String startTime);

}
