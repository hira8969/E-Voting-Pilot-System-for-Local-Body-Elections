package org.evoting.auth.controller;

import jakarta.validation.Valid;
import org.evoting.auth.dto.*;
import org.evoting.auth.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/register-voter")
    public ResponseEntity<AuthResponse> registerVoter(@Valid @RequestBody VoterRegisterRequest request) {
        AuthResponse response = authService.registerVoter(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/otp/send")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody OtpSendRequest request) {
        OtpResponse response = authService.sendOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/otp/verify-login")
    public ResponseEntity<AuthResponse> verifyOtpLogin(@Valid @RequestBody OtpVerifyLoginRequest request) {
        AuthResponse response = authService.loginWithOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        TokenRefreshResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserSummaryDto> getUserProfile(@PathVariable("id") Long id) {
        UserSummaryDto user = authService.getUserProfile(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validate() {
        return ResponseEntity.ok("Token is valid");
    }
}
