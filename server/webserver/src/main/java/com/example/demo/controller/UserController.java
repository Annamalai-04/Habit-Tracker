package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ------------------------------------------------
    // GET PROFILE
    // ------------------------------------------------

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(
            @PathVariable String userId) {

        return userRepository.findById(userId)
                .map(user -> {

                    // Don't return password
                    user.setPassword(null);

                    return ResponseEntity.ok(user);
                })
                .orElseGet(() ->
                    ResponseEntity.notFound().build()
                );
    }

    // ------------------------------------------------
    // UPDATE PROFILE
    // ------------------------------------------------

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable String userId,
            @RequestBody ProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.name() != null) {
            user.setName(request.name());
        }

        if (request.email() != null) {
            user.setEmail(request.email());
        }

        if (request.dob() != null) {
            user.setDob(request.dob());
        }

        User saved = userRepository.save(user);

        saved.setPassword(null);

        return ResponseEntity.ok(saved);
    }

    public record ProfileRequest(
            String name,
            String email,
            java.time.LocalDate dob
    ) {}
}