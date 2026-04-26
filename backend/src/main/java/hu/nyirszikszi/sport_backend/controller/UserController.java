package hu.nyirszikszi.sport_backend.controller;

import hu.nyirszikszi.sport_backend.model.User;
import hu.nyirszikszi.sport_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            throw new RuntimeException("A jelszó nem lehet üres!");
        }

        String hashedPassword = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(hashedPassword);
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();

        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Felhasználó nem található"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bejelentkezett felhasználó nem található"));


        if (currentUser.getRole().equals("ADMIN")) {
            if (targetUser.getRole().equals("ADMIN") && !targetUser.getEmail().equals(currentUserEmail)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin nem törölhet másik admint!");
            }
            userRepository.deleteById(id);
        }
        else if (targetUser.getEmail().equals(currentUserEmail)) {
            userRepository.deleteById(id);
        }
        else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nincs jogosultságod ezen fiók törléséhez!");
        }
    }
}