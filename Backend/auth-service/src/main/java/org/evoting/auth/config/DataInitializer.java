package org.evoting.auth.config;

import org.evoting.auth.entity.Role;
import org.evoting.auth.entity.User;
import org.evoting.auth.repository.RoleRepository;
import org.evoting.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAuthData(RoleRepository roleRepository,
                                          UserRepository userRepository,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed roles if missing
            Role roleAdmin = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));

            Role roleSuperAdmin = roleRepository.findByName("ROLE_SUPER_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_SUPER_ADMIN").build()));

            Role roleCandidate = roleRepository.findByName("ROLE_CANDIDATE")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_CANDIDATE").build()));

            Role roleParty = roleRepository.findByName("ROLE_PARTY")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_PARTY").build()));

            Role roleVoter = roleRepository.findByName("ROLE_VOTER")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_VOTER").build()));

            Role roleAuditor = roleRepository.findByName("ROLE_AUDITOR")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_AUDITOR").build()));

            // Seed default System Admin if not present
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@evoting.local")
                        .password(passwordEncoder.encode("Admin@12345"))
                        .enabled(true)
                        .roles(Set.of(roleAdmin))
                        .build();
                userRepository.save(admin);
            }

            // Seed Super Admin if not present
            if (!userRepository.existsByUsername("superadmin")) {
                User superAdmin = User.builder()
                        .username("superadmin")
                        .email("superadmin@evoting.local")
                        .password(passwordEncoder.encode("SuperAdmin@12345"))
                        .enabled(true)
                        .roles(Set.of(roleSuperAdmin, roleAdmin))
                        .build();
                userRepository.save(superAdmin);
            }
        };
    }
}
