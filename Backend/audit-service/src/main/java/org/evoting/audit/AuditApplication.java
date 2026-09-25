package org.evoting.audit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Audit Service Application for E-Voting Pilot System.
 * Records administrative actions, lifecycle state transitions, and security events.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class AuditApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuditApplication.class, args);
    }
}
