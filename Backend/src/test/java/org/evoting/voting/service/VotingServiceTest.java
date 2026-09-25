package org.evoting.voting.service;

import org.evoting.candidate.entity.Candidate;
import org.evoting.candidate.repository.CandidateRepository;
import org.evoting.election.entity.Election;
import org.evoting.election.entity.ElectionStatus;
import org.evoting.election.repository.ElectionRepository;
import org.evoting.voter.entity.Voter;
import org.evoting.voter.repository.VoterRepository;
import org.evoting.voting.dto.CastVoteDto;
import org.evoting.voting.dto.VoteReceiptDto;
import org.evoting.voting.entity.Vote;
import org.evoting.voting.repository.VoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VotingServiceTest {

    @Mock VoteRepository voteRepository;
    @Mock VoterRepository voterRepository;
    @Mock ElectionRepository electionRepository;
    @Mock CandidateRepository candidateRepository;

    @InjectMocks VotingService votingService;

    // Shared test fixtures
    Voter approvedVoter;
    Election activeElection;
    Candidate approvedCandidate;
    CastVoteDto validDto;

    @BeforeEach
    void setUp() {
        approvedVoter = new Voter();
        approvedVoter.setId(1L);
        approvedVoter.setVerified(true);
        approvedVoter.setHasVoted(false);
        approvedVoter.setEpicNumber("TEST001");
        approvedVoter.setFullName("Test Voter");
        approvedVoter.setEmail("voter@test.com");
        approvedVoter.setPhone("9999999999");
        approvedVoter.setConstituency("Ward 12");

        activeElection = new Election();
        activeElection.setId(10L);
        activeElection.setTitle("Test Election 2026");
        activeElection.setStatus(ElectionStatus.ACTIVE);
        activeElection.setStartDate(LocalDateTime.now().minusDays(1));
        activeElection.setEndDate(LocalDateTime.now().plusDays(1));
        activeElection.setElectionType("Municipal");

        approvedCandidate = new Candidate();
        approvedCandidate.setId(100L);
        approvedCandidate.setElectionId(10L);
        approvedCandidate.setFullName("Test Candidate");
        approvedCandidate.setPartyName("Test Party");
        approvedCandidate.setNominationStatus("APPROVED");
        approvedCandidate.setConstituency("Ward 12");

        validDto = new CastVoteDto(10L, 1L, 100L, "Ward 12");
    }

    // -------------------------------------------------------------------------
    // Happy path
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Valid vote is persisted and receipt is returned")
    void castVote_validRequest_persistsAndReturnsReceipt() {
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));
        when(voteRepository.existsByElectionIdAndVoterId(10L, 1L)).thenReturn(false);
        when(candidateRepository.findById(100L)).thenReturn(Optional.of(approvedCandidate));

        Vote savedVote = new Vote(5L, 10L, 1L, 100L, "Ward 12", LocalDateTime.now(), "abc123");
        when(voteRepository.save(any(Vote.class))).thenReturn(savedVote);
        when(voterRepository.save(any(Voter.class))).thenReturn(approvedVoter);

        VoteReceiptDto receipt = votingService.castVote(validDto);

        assertThat(receipt).isNotNull();
        assertThat(receipt.getVoteId()).isEqualTo(5L);
        assertThat(receipt.getElectionId()).isEqualTo(10L);
        assertThat(receipt.getVoterId()).isEqualTo(1L);
        assertThat(receipt.getCandidateId()).isEqualTo(100L);
        assertThat(receipt.getStatusMessage()).contains("recorded");

        // Verify voter.hasVoted was updated in the same transaction
        ArgumentCaptor<Voter> voterCaptor = ArgumentCaptor.forClass(Voter.class);
        verify(voterRepository).save(voterCaptor.capture());
        assertThat(voterCaptor.getValue().isHasVoted()).isTrue();
    }

    // -------------------------------------------------------------------------
    // Rule 1: Voter must be approved
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Unapproved voter is rejected with clear message")
    void castVote_unapprovedVoter_throwsIllegalState() {
        approvedVoter.setVerified(false);
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not approved to vote");

        verify(voteRepository, never()).save(any());
    }

    @Test
    @DisplayName("Unknown voter ID is rejected")
    void castVote_voterNotFound_throwsIllegalArgument() {
        when(voterRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Voter not found");
    }

    // -------------------------------------------------------------------------
    // Rule 2: Election must be open
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Vote on UPCOMING election is rejected")
    void castVote_upcomingElection_throwsIllegalState() {
        activeElection.setStatus(ElectionStatus.UPCOMING);
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not currently open for voting");

        verify(voteRepository, never()).save(any());
    }

    @Test
    @DisplayName("Vote on COMPLETED election is rejected")
    void castVote_completedElection_throwsIllegalState() {
        activeElection.setStatus(ElectionStatus.COMPLETED);
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not currently open for voting");
    }

    @Test
    @DisplayName("Vote on ONGOING election is accepted (legacy alias)")
    void castVote_ongoingElection_accepted() {
        activeElection.setStatus(ElectionStatus.ONGOING);
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));
        when(voteRepository.existsByElectionIdAndVoterId(10L, 1L)).thenReturn(false);
        when(candidateRepository.findById(100L)).thenReturn(Optional.of(approvedCandidate));
        Vote savedVote = new Vote(5L, 10L, 1L, 100L, "Ward 12", LocalDateTime.now(), "abc");
        when(voteRepository.save(any(Vote.class))).thenReturn(savedVote);
        when(voterRepository.save(any(Voter.class))).thenReturn(approvedVoter);

        VoteReceiptDto receipt = votingService.castVote(validDto);
        assertThat(receipt).isNotNull();
    }

    // -------------------------------------------------------------------------
    // Rule 3: Duplicate vote prevention
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Duplicate vote is rejected with conflict message")
    void castVote_duplicateVote_throwsIllegalState() {
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));
        when(voteRepository.existsByElectionIdAndVoterId(10L, 1L)).thenReturn(true);

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already cast a ballot");

        verify(voteRepository, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // Rule 4: Candidate must be APPROVED and belong to this election
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Rejected candidate is not shown on ballot")
    void castVote_rejectedCandidate_throwsIllegalState() {
        approvedCandidate.setNominationStatus("REJECTED");
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));
        when(voteRepository.existsByElectionIdAndVoterId(10L, 1L)).thenReturn(false);
        when(candidateRepository.findById(100L)).thenReturn(Optional.of(approvedCandidate));

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not an approved candidate");

        verify(voteRepository, never()).save(any());
    }

    @Test
    @DisplayName("Candidate from different election is rejected")
    void castVote_candidateWrongElection_throwsIllegalState() {
        approvedCandidate.setElectionId(999L); // Different election
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));
        when(voteRepository.existsByElectionIdAndVoterId(10L, 1L)).thenReturn(false);
        when(candidateRepository.findById(100L)).thenReturn(Optional.of(approvedCandidate));

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("does not belong to election");

        verify(voteRepository, never()).save(any());
    }

    @Test
    @DisplayName("Unknown candidate ID is rejected")
    void castVote_candidateNotFound_throwsIllegalArgument() {
        when(voterRepository.findById(1L)).thenReturn(Optional.of(approvedVoter));
        when(electionRepository.findById(10L)).thenReturn(Optional.of(activeElection));
        when(voteRepository.existsByElectionIdAndVoterId(10L, 1L)).thenReturn(false);
        when(candidateRepository.findById(100L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> votingService.castVote(validDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Candidate not found");
    }

    // -------------------------------------------------------------------------
    // hasVoted
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("hasVoted delegates correctly to repository")
    void hasVoted_delegatesToRepository() {
        when(voteRepository.existsByElectionIdAndVoterId(10L, 1L)).thenReturn(true);
        assertThat(votingService.hasVoted(10L, 1L)).isTrue();
    }
}
