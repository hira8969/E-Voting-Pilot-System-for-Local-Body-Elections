package org.evoting.voting.repository;

import org.evoting.voting.entity.VoterBallotReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoterBallotReceiptRepository extends JpaRepository<VoterBallotReceipt, Long> {
    boolean existsByElectionIdAndVoterId(Long electionId, Long voterId);
    Optional<VoterBallotReceipt> findByElectionIdAndVoterId(Long electionId, Long voterId);
    Optional<VoterBallotReceipt> findByReceiptHash(String receiptHash);
    long countByElectionId(Long electionId);
}
