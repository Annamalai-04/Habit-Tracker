package com.example.demo.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.services.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;

    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    public AuthController(
            AuthService authService,
            AuthenticationManager authenticationManager) {

        this.authService = authService;
        this.authenticationManager = authenticationManager;
    }

    // ------------------------------------------------
    // SIGN UP
    // ------------------------------------------------

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User user = authService.register(
                    request.name(),
                    request.username(),
                    request.email(),
                    request.password(),
                    request.dob()
            );

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Account created successfully");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("name", user.getName());
            response.put("email", user.getEmail());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                        "error", e.getMessage()
                    ));
        }
    }

    // ------------------------------------------------
    // SIGN IN
    // ------------------------------------------------

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                            request.username(),
                            request.password()
                        )
                    );

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);

            SecurityContextHolder.setContext(context);

            securityContextRepository.saveContext(
                    context,
                    httpRequest,
                    httpResponse
            );
            User user = authService.getUserByUsername(
                    authentication.getName()
            );

            return ResponseEntity.ok(
                    Map.of(
                        "message", "Login successful",
                        "userId", user.getId(),
                        "username", user.getUsername(),
                        "name", user.getName(),
                        "email", user.getEmail()
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "error", "Invalid username or password"
                    ));
        }
    }

    // ------------------------------------------------
    // LOGOUT
    // ------------------------------------------------

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request) {

        SecurityContextHolder.clearContext();

        var session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    // ------------------------------------------------
    // CURRENT USER
    // ------------------------------------------------

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(
            Authentication authentication) {

        if (authentication == null ||
            !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "error", "Not signed in"
                    ));
        }

        return ResponseEntity.ok(
                Map.of(
                    "username",
                    authentication.getName()
                )
        );
    }

    // ------------------------------------------------
    // REQUEST RECORDS
    // ------------------------------------------------

    public record RegisterRequest(
            String name,
            String username,
            String email,
            String password,
            LocalDate dob
    ) {}

    public record LoginRequest(
            String username,
            String password
    ) {}
}