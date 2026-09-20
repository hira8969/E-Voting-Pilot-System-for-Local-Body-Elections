package org.evoting.candidate.repository;

import org.evoting.candidate.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByElectionId(Long electionId);
    List<Candidate> findByElectionIdAndConstituency(Long electionId, String constituency);
    List<Candidate> findByConstituency(String constituency);
}
