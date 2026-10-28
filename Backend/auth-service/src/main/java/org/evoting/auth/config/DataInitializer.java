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

            // Seed default Voter
            if (!userRepository.existsByUsername("voter")) {
                User voter = User.builder()
                        .username("voter")
                        .email("voter@evoting.local")
                        .password(passwordEncoder.encode("Voter@12345"))
                        .fullName("Aarav Kumar")
                        .epicNumber("VTR2026881")
                        .phone("9876543210")
                        .constituency("28 - Sitamarhi")
                        .enabled(true)
                        .roles(Set.of(roleVoter))
                        .build();
                userRepository.save(voter);
            }

            // Seed default Candidate
            if (!userRepository.existsByUsername("candidate")) {
                User candidate = User.builder()
                        .username("candidate")
                        .email("candidate@evoting.local")
                        .password(passwordEncoder.encode("Candidate@12345"))
                        .fullName("Arjun Sharma")
                        .constituency("28 - Sitamarhi")
                        .enabled(true)
                        .roles(Set.of(roleCandidate))
                        .build();
                userRepository.save(candidate);
            }

            // Seed default Party Rep
            if (!userRepository.existsByUsername("party")) {
                User party = User.builder()
                        .username("party")
                        .email("party@evoting.local")
                        .password(passwordEncoder.encode("Party@12345"))
                        .fullName("Bharatiya Janata Party Representative")
                        .constituency("Bihar State")
                        .enabled(true)
                        .roles(Set.of(roleParty))
                        .build();
                userRepository.save(party);
            }

            // Seed default System Admin
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@evoting.local")
                        .password(passwordEncoder.encode("Admin@12345"))
                        .fullName("State Election Commission Admin")
                        .enabled(true)
                        .roles(Set.of(roleAdmin))
                        .build();
                userRepository.save(admin);
            }

            // Seed Super Admin
            if (!userRepository.existsByUsername("superadmin")) {
                User superAdmin = User.builder()
                        .username("superadmin")
                        .email("superadmin@evoting.local")
                        .password(passwordEncoder.encode("SuperAdmin@12345"))
                        .fullName("Chief Electoral Officer (Super Admin)")
                        .enabled(true)
                        .roles(Set.of(roleSuperAdmin, roleAdmin))
                        .build();
                userRepository.save(superAdmin);
            }

            // Seed default Auditor
            if (!userRepository.existsByUsername("auditor")) {
                User auditor = User.builder()
                        .username("auditor")
                        .email("auditor@evoting.local")
                        .password(passwordEncoder.encode("Auditor@12345"))
                        .fullName("Independent Electoral Audit Officer")
                        .enabled(true)
                        .roles(Set.of(roleAuditor))
                        .build();
                userRepository.save(auditor);
            }
        };
    }
}
