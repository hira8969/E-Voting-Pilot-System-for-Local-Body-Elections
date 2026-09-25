package org.evoting.candidate;

import org.evoting.candidate.dto.CandidateDto;
import org.evoting.candidate.entity.Candidate;
import org.evoting.candidate.service.CandidateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CandidateServiceTests {

    @Autowired
    private CandidateService candidateService;

    @Test
    void testCandidateCrudWorkflow() {
        CandidateDto dto = CandidateDto.builder()
                .electionId(10L)
                .fullName("Sarah Connor")
                .partyName("Democratic Alliance")
                .symbolUrl("/symbols/sun.png")
                .constituency("Sector-4")
                .bio("Dedicated student union candidate.")
                .manifesto("Better campus transport and transparent grading.")
                .build();

        Candidate candidate = candidateService.addCandidate(dto);
        assertNotNull(candidate.getId());
        assertEquals("Sarah Connor", candidate.getFullName());

        List<Candidate> byElection = candidateService.getCandidatesByElection(10L);
        assertFalse(byElection.isEmpty());

        List<Candidate> byConstituency = candidateService.getCandidatesByElectionAndConstituency(10L, "Sector-4");
        assertEquals(1, byConstituency.size());
    }
}
