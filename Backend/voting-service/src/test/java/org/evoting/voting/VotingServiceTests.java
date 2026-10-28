package org.evoting.voting;

import org.evoting.voting.client.AuditClient;
import org.evoting.voting.client.VoterClient;
import org.evoting.voting.dto.CandidateTallyDto;
import org.evoting.voting.dto.CastVoteDto;
import org.evoting.voting.dto.VoteReceiptDto;
import org.evoting.voting.repository.VoteRepository;
import org.evoting.voting.service.VotingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

@SpringBootTest
class VotingServiceTests {

    @Autowired
    private VotingService votingService;

    @Autowired
    private VoteRepository voteRepository;

    @MockBean
    private VoterClient voterClient;

    @MockBean
    private AuditClient auditClient;

    @BeforeEach
    void setUp() {
        voteRepository.deleteAll();

        // Default: voter is eligible
        Mockito.when(voterClient.checkEligibility(anyLong()))
                .thenReturn(ResponseEntity.ok(Map.of("eligible", true, "voterId", 101L)));

        Mockito.when(voterClient.updateVoteStatus(anyLong(), Mockito.anyBoolean()))
                .thenReturn(ResponseEntity.ok().build());

        Mockito.when(auditClient.logEvent(any()))
                .thenReturn(ResponseEntity.ok(Map.of("status", "SUCCESS")));
    }

    @Test
    void testCastVoteSuccess() {
        CastVoteDto dto = new CastVoteDto(1L, 101L, 5L, "28 - Sitamarhi");

        VoteReceiptDto receipt = votingService.castVote(dto);

        assertNotNull(receipt);
        assertEquals(1L, receipt.getElectionId());
        assertEquals(101L, receipt.getVoterId());
        assertEquals(5L, receipt.getCandidateId());
        assertEquals("28 - Sitamarhi", receipt.getConstituency());
        assertNotNull(receipt.getVoteHash());
        assertEquals(64, receipt.getVoteHash().length(), "SHA-256 hash must be 64 hexadecimal characters");
        assertNotNull(receipt.getReceiptNumber());
        assertTrue(receipt.getReceiptNumber().startsWith("EV-2026-"));
        assertTrue(receipt.getTransactionId().startsWith("0x"));
        assertEquals("CONFIRMED", receipt.getStatus());

        // Verify repository state
        assertTrue(votingService.hasVoted(1L, 101L));
        assertEquals(1, votingService.getTotalVotesForElection(1L));
        assertEquals(1, votingService.getVotesForCandidate(1L, 5L));
    }

    @Test
    void testDoubleVoteThrowsConflictException() {
        CastVoteDto firstVote = new CastVoteDto(1L, 102L, 5L, "28 - Sitamarhi");
        votingService.castVote(firstVote);

        CastVoteDto secondVote = new CastVoteDto(1L, 102L, 6L, "28 - Sitamarhi");

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            votingService.castVote(secondVote);
        });

        assertTrue(ex.getMessage().contains("already cast a ballot"));
        assertEquals(1, votingService.getTotalVotesForElection(1L));
    }

    @Test
    void testElectionTalliesAccurateAggregation() {
        // Cast votes for candidate 1 and candidate 2
        votingService.castVote(new CastVoteDto(2L, 201L, 10L, "Dumra"));
        votingService.castVote(new CastVoteDto(2L, 202L, 10L, "Dumra"));
        votingService.castVote(new CastVoteDto(2L, 203L, 20L, "Dumra"));

        assertEquals(3, votingService.getTotalVotesForElection(2L));
        assertEquals(2, votingService.getVotesForCandidate(2L, 10L));
        assertEquals(1, votingService.getVotesForCandidate(2L, 20L));

        List<CandidateTallyDto> tallies = votingService.getElectionTallies(2L);
        assertNotNull(tallies);
        assertEquals(2, tallies.size());
    }

    @Test
    void testIneligibleVoterRejected() {
        Mockito.when(voterClient.checkEligibility(999L))
                .thenReturn(ResponseEntity.ok(Map.of("eligible", false, "reason", "Voter unverified")));

        CastVoteDto dto = new CastVoteDto(1L, 999L, 5L, "28 - Sitamarhi");

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            votingService.castVote(dto);
        });

        assertTrue(ex.getMessage().contains("not eligible"));
    }
}
