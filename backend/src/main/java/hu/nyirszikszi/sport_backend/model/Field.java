package hu.nyirszikszi.sport_backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "fields")
public class Field {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String sportType;
    private int pricePerHour;
    private boolean isCovered;

    public Field() {
    }

    public Field(String name, String sportType, int pricePerHour, boolean isCovered) {
        this.name = name;
        this.sportType = sportType;
        this.pricePerHour = pricePerHour;
        this.isCovered = isCovered;
    }

    @OneToMany(mappedBy = "field", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reservation> reservations;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSportType() {
        return sportType;
    }

    public void setSportType(String sportType) {
        this.sportType = sportType;
    }

    public int getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(int pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public boolean isCovered() {
        return isCovered;
    }

    public void setCovered(boolean covered) {
        isCovered = covered;
    }
}