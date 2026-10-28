package org.evoting.result;

import org.evoting.result.dto.CandidateResultDto;
import org.evoting.result.dto.ElectionResultResponse;
import org.evoting.result.dto.external.CandidateDto;
import org.evoting.result.dto.external.CandidateTallyDto;
import org.evoting.result.dto.external.ElectionDto;
import org.evoting.result.service.ResultService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;

@SpringBootTest
class ResultServiceTests {

    @Autowired
    private ResultService resultService;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    void testElectionResultsCalculationAndWinner() {
        Long electionId = 1L;

        ElectionDto mockElection = new ElectionDto();
        mockElection.setId(electionId);
        mockElection.setTitle("Local Body General Election 2026");
        mockElection.setStatus("ACTIVE");

        CandidateDto c1 = new CandidateDto();
        c1.setId(10L);
        c1.setFullName("Candidate Alpha");
        c1.setPartyName("Party A");
        c1.setConstituency("Sitamarhi Central");

        CandidateDto c2 = new CandidateDto();
        c2.setId(20L);
        c2.setFullName("Candidate Beta");
        c2.setPartyName("Party B");
        c2.setConstituency("Sitamarhi Central");

        CandidateDto[] candidateArray = new CandidateDto[]{c1, c2};

        CandidateTallyDto t1 = new CandidateTallyDto(10L, 75L);
        CandidateTallyDto t2 = new CandidateTallyDto(20L, 25L);
        CandidateTallyDto[] tallyArray = new CandidateTallyDto[]{t1, t2};

        Mockito.when(restTemplate.getForObject(contains("/api/elections/1"), eq(ElectionDto.class)))
                .thenReturn(mockElection);

        Mockito.when(restTemplate.getForObject(contains("/api/candidates/election/1"), eq(CandidateDto[].class)))
                .thenReturn(candidateArray);

        Mockito.when(restTemplate.getForObject(contains("/api/votes/election/1/tallies"), eq(CandidateTallyDto[].class)))
                .thenReturn(tallyArray);

        ElectionResultResponse response = resultService.getElectionResults(electionId);

        assertNotNull(response);
        assertEquals(electionId, response.getElectionId());
        assertEquals("Local Body General Election 2026", response.getElectionTitle());
        assertEquals(100L, response.getTotalVotesCast());
        assertEquals(2, response.getCandidates().size());

        CandidateResultDto winner = response.getLeadingOrWinner();
        assertNotNull(winner);
        assertEquals(10L, winner.getCandidateId());
        assertEquals("Candidate Alpha", winner.getFullName());
        assertEquals(75L, winner.getVoteCount());
        assertEquals(75.0, winner.getVotePercentage());
    }

    @Test
    void testZeroVotesReturnsNullWinnerGracefully() {
        Long electionId = 2L;

        ElectionDto mockElection = new ElectionDto();
        mockElection.setId(electionId);
        mockElection.setTitle("Empty Election 2026");
        mockElection.setStatus("ACTIVE");

        CandidateDto[] emptyCandidates = new CandidateDto[]{};
        CandidateTallyDto[] emptyTallies = new CandidateTallyDto[]{};

        Mockito.when(restTemplate.getForObject(contains("/api/elections/2"), eq(ElectionDto.class)))
                .thenReturn(mockElection);
        Mockito.when(restTemplate.getForObject(contains("/api/candidates/election/2"), eq(CandidateDto[].class)))
                .thenReturn(emptyCandidates);
        Mockito.when(restTemplate.getForObject(contains("/api/votes/election/2/tallies"), eq(CandidateTallyDto[].class)))
                .thenReturn(emptyTallies);

        ElectionResultResponse response = resultService.getElectionResults(electionId);

        assertNotNull(response);
        assertEquals(0L, response.getTotalVotesCast());
        assertNull(response.getLeadingOrWinner());
    }
}
