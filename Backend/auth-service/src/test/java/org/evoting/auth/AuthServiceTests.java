package org.evoting.auth;

import org.evoting.auth.dto.AuthResponse;
import org.evoting.auth.dto.LoginRequest;
import org.evoting.auth.dto.RegisterRequest;
import org.evoting.auth.exception.DuplicateResourceException;
import org.evoting.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTests {

    @Autowired
    private AuthService authService;

    @Test
    void testRegisterAndLoginWorkflow() {
        RegisterRequest register = RegisterRequest.builder()
                .username("john_doe")
                .email("john@example.com")
                .password("Password123")
                .role("ROLE_VOTER")
                .build();

        AuthResponse regResponse = authService.register(register);
        assertNotNull(regResponse.getAccessToken());
        assertNotNull(regResponse.getRefreshToken());
        assertEquals("john_doe", regResponse.getUsername());

        // Test login
        LoginRequest login = LoginRequest.builder()
                .username("john_doe")
                .password("Password123")
                .build();

        AuthResponse loginResponse = authService.login(login);
        assertNotNull(loginResponse.getAccessToken());
        assertEquals(regResponse.getUserId(), loginResponse.getUserId());
    }

    @Test
    void testDuplicateUsernameRejection() {
        RegisterRequest user1 = RegisterRequest.builder()
                .username("unique_user")
                .email("user1@example.com")
                .password("Password123")
                .build();
        authService.register(user1);

        RegisterRequest user2 = RegisterRequest.builder()
                .username("unique_user")
                .email("user2@example.com")
                .password("Password123")
                .build();

        assertThrows(DuplicateResourceException.class, () -> authService.register(user2));
    }
}
