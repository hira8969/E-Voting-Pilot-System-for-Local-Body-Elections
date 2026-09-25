package org.evoting.voting.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Audit receipt recording that a voter has participated in an election.
 * Enforces strict one-vote-per-voter per election via the compound unique constraint.
 * Voter identity is preserved here for verification, but candidate choice is omitted for ballot privacy.
 */
@Entity
@Table(
        name = "voter_ballot_receipts",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_election_voter", columnNames = {"election_id", "voter_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoterBallotReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "election_id", nullable = false)
    private Long electionId;

    @Column(name = "voter_id", nullable = false)
    private Long voterId;

    @Column(name = "receipt_hash", nullable = false, unique = true, length = 64)
    private String receiptHash;

    @Column(name = "cast_at", nullable = false)
    private LocalDateTime castAt;
}
