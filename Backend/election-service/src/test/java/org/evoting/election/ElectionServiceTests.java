package org.evoting.election;

import org.evoting.election.dto.ElectionDto;
import org.evoting.election.entity.Election;
import org.evoting.election.entity.ElectionStatus;
import org.evoting.election.exception.InvalidElectionStateException;
import org.evoting.election.service.ElectionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ElectionServiceTests {

    @Autowired
    private ElectionService electionService;

    @Test
    void testElectionLifecycleTransitions() {
        ElectionDto dto = ElectionDto.builder()
                .title("Campus Senate 2026")
                .description("Student representative election")
                .startDate(LocalDateTime.now().minusHours(1))
                .endDate(LocalDateTime.now().plusHours(5))
                .status(ElectionStatus.DRAFT)
                .electionType("Campus")
                .build();

        Election election = electionService.createElection(dto);
        assertEquals(ElectionStatus.DRAFT, election.getStatus());

        // Valid transition: DRAFT -> SCHEDULED
        election = electionService.updateElectionStatus(election.getId(), ElectionStatus.SCHEDULED);
        assertEquals(ElectionStatus.SCHEDULED, election.getStatus());

        // Valid transition: SCHEDULED -> ACTIVE
        election = electionService.updateElectionStatus(election.getId(), ElectionStatus.ACTIVE);
        assertEquals(ElectionStatus.ACTIVE, election.getStatus());
        assertTrue(electionService.isElectionOpenForVoting(election.getId()));

        // Valid transition: ACTIVE -> COMPLETED
        election = electionService.updateElectionStatus(election.getId(), ElectionStatus.COMPLETED);
        assertEquals(ElectionStatus.COMPLETED, election.getStatus());

        // Invalid transition: COMPLETED -> ACTIVE (terminal state)
        final Long electionId = election.getId();
        assertThrows(InvalidElectionStateException.class, () ->
                electionService.updateElectionStatus(electionId, ElectionStatus.ACTIVE)
        );
    }
}
