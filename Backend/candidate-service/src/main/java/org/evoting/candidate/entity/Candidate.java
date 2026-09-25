package org.evoting.candidate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "election_id", nullable = false)
    private Long electionId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "party_name", nullable = false, length = 100)
    private String partyName;

    @Column(name = "symbol_url", length = 255)
    private String symbolUrl;

    @Column(nullable = false, length = 100)
    private String constituency;

    @Column(length = 1000)
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String manifesto;

    @Column(name = "nomination_status", nullable = false, length = 30)
    @Builder.Default
    private String nominationStatus = "APPROVED"; // PENDING, APPROVED, REJECTED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
