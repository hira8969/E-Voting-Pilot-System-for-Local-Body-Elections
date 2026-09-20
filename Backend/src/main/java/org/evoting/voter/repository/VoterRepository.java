package org.evoting.voter.repository;

import org.evoting.voter.entity.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoterRepository extends JpaRepository<Voter, Long> {
    Optional<Voter> findByEpicNumber(String epicNumber);
    Optional<Voter> findByEmail(String email);
    boolean existsByEpicNumber(String epicNumber);
    boolean existsByEmail(String email);
}
