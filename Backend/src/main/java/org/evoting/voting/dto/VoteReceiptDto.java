package org.evoting.voting.dto;

import java.time.LocalDateTime;

public class VoteReceiptDto {

    private Long voteId;
    private Long electionId;
    private Long voterId;
    private Long candidateId;
    private String constituency;
    private LocalDateTime timestamp;
    private String voteHash;
    private String statusMessage;

    public VoteReceiptDto() {
    }

    public VoteReceiptDto(Long voteId, Long electionId, Long voterId, Long candidateId, String constituency, LocalDateTime timestamp, String voteHash, String statusMessage) {
        this.voteId = voteId;
        this.electionId = electionId;
        this.voterId = voterId;
        this.candidateId = candidateId;
        this.constituency = constituency;
        this.timestamp = timestamp;
        this.voteHash = voteHash;
        this.statusMessage = statusMessage;
    }

    public Long getVoteId() {
        return voteId;
    }

    public void setVoteId(Long voteId) {
        this.voteId = voteId;
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getVoteHash() {
        return voteHash;
    }

    public void setVoteHash(String voteHash) {
        this.voteHash = voteHash;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }
}
