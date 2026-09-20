package org.evoting.voting.repository;

import org.evoting.voting.dto.CandidateTallyDto;
import org.evoting.voting.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByElectionIdAndVoterId(Long electionId, Long voterId);
    long countByElectionId(Long electionId);
    long countByElectionIdAndCandidateId(Long electionId, Long candidateId);
    List<Vote> findByElectionId(Long electionId);

    @Query("SELECT new org.evoting.voting.dto.CandidateTallyDto(v.candidateId, COUNT(v.id)) " +
           "FROM Vote v WHERE v.electionId = :electionId GROUP BY v.candidateId")
    List<CandidateTallyDto> countVotesByElectionGroupedByCandidate(@Param("electionId") Long electionId);
}
