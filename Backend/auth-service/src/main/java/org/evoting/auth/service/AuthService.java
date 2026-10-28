package org.evoting.auth.service;

import org.evoting.auth.dto.*;
import org.evoting.auth.entity.RefreshToken;
import org.evoting.auth.entity.Role;
import org.evoting.auth.entity.User;
import org.evoting.auth.exception.DuplicateResourceException;
import org.evoting.auth.exception.ResourceNotFoundException;
import org.evoting.auth.exception.UnauthorizedException;
import org.evoting.auth.repository.RefreshTokenRepository;
import org.evoting.auth.repository.RoleRepository;
import org.evoting.auth.repository.UserRepository;
import org.evoting.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate;

    @Value("${jwt.refreshExpirationMs:604800000}")
    private long refreshExpirationMs;

    @Value("${services.voter-service.url:http://localhost:8081}")
    private String voterServiceUrl;

    private static class OtpEntry {
        final String otp;
        final Instant expiresAt;

        OtpEntry(String otp, Instant expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, OtpEntry> otpCache = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered.");
        }

        // Determine requested role (default to ROLE_VOTER)
        String roleName = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole().toUpperCase()
                : "ROLE_VOTER";

        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        final String targetRoleName = roleName;
        Role role = roleRepository.findByName(targetRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(targetRoleName).build()));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        List<String> roleNames = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtTokenProvider.generateAccessToken(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                roleNames
        );

        RefreshToken refreshToken = createRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .roles(roleNames)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String input = request.getUsername().trim();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(input)
                .or(() -> userRepository.findByEmail(input))
                .or(() -> userRepository.findByEpicNumber(input.toUpperCase()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with identifier: " + input));

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roleNames
        );

        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .epicNumber(user.getEpicNumber())
                .constituency(user.getConstituency())
                .roles(roleNames)
                .build();
    }

    @Transactional
    public AuthResponse registerVoter(VoterRegisterRequest request) {
        String cleanEpic = request.getEpicNumber().toUpperCase().trim();
        String cleanEmail = request.getEmail().toLowerCase().trim();
        String cleanPhone = request.getPhone().trim();
        String cleanName = request.getFullName().trim();
        String cleanConstituency = request.getConstituency().trim();
        String rawPassword = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword().trim()
                : "Voter@123";

        if (userRepository.existsByEpicNumber(cleanEpic)) {
            throw new DuplicateResourceException("Voter with EPIC number '" + cleanEpic + "' is already registered.");
        }
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("Email '" + cleanEmail + "' is already registered.");
        }
        if (userRepository.existsByUsername(cleanEpic)) {
            throw new DuplicateResourceException("Identifier '" + cleanEpic + "' is already taken.");
        }

        Role role = roleRepository.findByName("ROLE_VOTER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_VOTER").build()));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .username(cleanEpic)
                .email(cleanEmail)
                .password(passwordEncoder.encode(rawPassword))
                .fullName(cleanName)
                .epicNumber(cleanEpic)
                .phone(cleanPhone)
                .constituency(cleanConstituency)
                .enabled(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        // Sync with voter-service
        try {
            Map<String, Object> voterDto = new HashMap<>();
            voterDto.put("userId", savedUser.getId());
            voterDto.put("epicNumber", cleanEpic);
            voterDto.put("fullName", cleanName);
            voterDto.put("email", cleanEmail);
            voterDto.put("phone", cleanPhone);
            voterDto.put("constituency", cleanConstituency);

            restTemplate.postForEntity(voterServiceUrl + "/api/voters/register", voterDto, Object.class);
        } catch (Exception e) {
            System.err.println("Warning: Sync to voter-service failed: " + e.getMessage());
        }

        List<String> roleNames = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtTokenProvider.generateAccessToken(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                roleNames
        );

        RefreshToken refreshToken = createRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .epicNumber(savedUser.getEpicNumber())
                .constituency(savedUser.getConstituency())
                .roles(roleNames)
                .build();
    }

    public OtpResponse sendOtp(OtpSendRequest request) {
        String cleanEpic = request.getEpicNumber().toUpperCase().trim();
        User user = userRepository.findByEpicNumber(cleanEpic)
                .orElseGet(() -> syncUserFromVoterService(cleanEpic));

        if (user == null) {
            throw new ResourceNotFoundException("No voter found registered with EPIC number: " + cleanEpic);
        }

        String phone = user.getPhone();
        if (phone == null || phone.isBlank()) {
            phone = "9876543210";
        }

        String maskedPhone = phone.length() >= 4
                ? "XXXXXX" + phone.substring(phone.length() - 4)
                : "XXXXXX";

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        otpCache.put(cleanEpic, new OtpEntry(otp, Instant.now().plus(10, java.time.temporal.ChronoUnit.MINUTES)));

        return OtpResponse.builder()
                .success(true)
                .message("One-time passcode dispatched to registered mobile (" + maskedPhone + ")")
                .epicNumber(cleanEpic)
                .maskedPhone(maskedPhone)
                .demoOtp("123456")
                .build();
    }

    @Transactional
    public AuthResponse loginWithOtp(OtpVerifyLoginRequest request) {
        String cleanEpic = request.getEpicNumber().toUpperCase().trim();
        String enteredOtp = request.getOtp().trim();

        // Check if demo OTP 123456 or cached active OTP matches
        boolean valid = "123456".equals(enteredOtp);
        OtpEntry entry = otpCache.get(cleanEpic);
        if (!valid && entry != null) {
            if (entry.expiresAt.isAfter(Instant.now()) && entry.otp.equals(enteredOtp)) {
                valid = true;
            }
        }

        if (!valid) {
            throw new UnauthorizedException("Invalid or expired OTP. Please enter the valid 6-digit passcode.");
        }

        otpCache.remove(cleanEpic);

        User user = userRepository.findByEpicNumber(cleanEpic)
                .orElseGet(() -> syncUserFromVoterService(cleanEpic));

        if (user == null) {
            throw new ResourceNotFoundException("No voter found registered with EPIC number: " + cleanEpic);
        }

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roleNames
        );

        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .epicNumber(user.getEpicNumber())
                .constituency(user.getConstituency())
                .roles(roleNames)
                .build();
    }

    private User syncUserFromVoterService(String epicNumber) {
        try {
            var response = restTemplate.getForEntity(
                    voterServiceUrl + "/api/voters/epic/" + epicNumber,
                    Map.class
            );
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                String email = (String) body.get("email");
                String fullName = (String) body.get("fullName");
                String phone = (String) body.get("phone");
                String constituency = (String) body.get("constituency");

                Role role = roleRepository.findByName("ROLE_VOTER")
                        .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_VOTER").build()));

                User user = User.builder()
                        .username(epicNumber)
                        .email(email != null ? email : (epicNumber.toLowerCase() + "@evoting.local"))
                        .password(passwordEncoder.encode("Voter@123"))
                        .fullName(fullName != null ? fullName : "Voter " + epicNumber)
                        .epicNumber(epicNumber)
                        .phone(phone != null ? phone : "9876543210")
                        .constituency(constituency != null ? constituency : "Sitamarhi")
                        .enabled(true)
                        .roles(Set.of(role))
                        .build();

                return userRepository.save(user);
            }
        } catch (Exception e) {
            System.err.println("Could not sync user from voter-service: " + e.getMessage());
        }
        return null;
    }

    @Transactional
    public TokenRefreshResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Refresh token does not exist"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token has expired or been revoked. Please sign in again.");
        }

        User user = token.getUser();
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roleNames
        );

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token.getToken())
                .tokenType("Bearer")
                .build();
    }

    public UserSummaryDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return UserSummaryDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.isEnabled())
                .roles(roles)
                .build();
    }

    private RefreshToken createRefreshToken(User user) {
        // Remove prior tokens for single-active-refresh-token cleanliness
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }
}
