package org.evoting.voting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CastVoteDto {

    @NotNull(message = "Election ID is required")
    private Long electionId;

    @NotNull(message = "Voter ID is required")
    private Long voterId;

    @NotNull(message = "Candidate ID is required")
    private Long candidateId;

    @NotBlank(message = "Constituency is required")
    private String constituency;

    public CastVoteDto() {
    }

    public CastVoteDto(Long electionId, Long voterId, Long candidateId, String constituency) {
        this.electionId = electionId;
        this.voterId = voterId;
        this.candidateId = candidateId;
        this.constituency = constituency;
    }

    public Long getElectionId() {
        return electionId;
    }

    public void setElectionId(Long electionId) {
        this.electionId = electionId;
    }

    public Long getVoterId() {
        return voterId;
    }

    public void setVoterId(Long voterId) {
        this.voterId = voterId;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getConstituency() {
        return constituency;
    }

    public void setConstituency(String constituency) {
        this.constituency = constituency;
    }
}
