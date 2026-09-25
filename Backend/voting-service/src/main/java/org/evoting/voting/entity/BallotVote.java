package org.evoting.voting.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Anonymized cast ballot entity.
 * Stores candidate choice and cryptographic seal completely decoupled from voter identity.
 */
@Entity
@Table(
        name = "ballot_votes",
        indexes = {
                @Index(name = "idx_ballot_election_candidate", columnList = "election_id, candidate_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BallotVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "election_id", nullable = false)
    private Long electionId;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(nullable = false, length = 100)
    private String constituency;

    @Column(name = "ballot_hash", nullable = false, length = 64)
    private String ballotHash;

    @Column(name = "cast_at", nullable = false)
    private LocalDateTime castAt;
}
