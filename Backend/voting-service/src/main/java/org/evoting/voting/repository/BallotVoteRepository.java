package org.evoting.voting.repository;

import org.evoting.voting.dto.CandidateTallyDto;
import org.evoting.voting.entity.BallotVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BallotVoteRepository extends JpaRepository<BallotVote, Long> {

    long countByElectionId(Long electionId);

    long countByElectionIdAndCandidateId(Long electionId, Long candidateId);

    @Query("SELECT new org.evoting.voting.dto.CandidateTallyDto(v.candidateId, COUNT(v)) " +
            "FROM BallotVote v WHERE v.electionId = :electionId GROUP BY v.candidateId")
    List<CandidateTallyDto> countVotesGroupedByCandidate(@Param("electionId") Long electionId);
}
