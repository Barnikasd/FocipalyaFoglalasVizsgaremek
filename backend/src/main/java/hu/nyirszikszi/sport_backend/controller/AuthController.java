package hu.nyirszikszi.sport_backend.controller;

import hu.nyirszikszi.sport_backend.model.User;
import hu.nyirszikszi.sport_backend.repository.UserRepository;
import hu.nyirszikszi.sport_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String rawPassword = loginData.get("passwordHash");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
                return Map.of("token", token, "role", user.getRole());
            }
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Hibás email vagy jelszó!");
    }
}