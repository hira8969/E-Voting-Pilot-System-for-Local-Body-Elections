package org.evoting.result.dto;

import java.util.List;

public class ElectionResultResponse {

    private Long electionId;
    private String electionTitle;
    private String electionStatus;
    private long totalVotesCast;
    private List<CandidateResultDto> candidates;
    private CandidateResultDto leadingOrWinner;

    public ElectionResultResponse() {
    }

    public ElectionResultResponse(Long electionId, String electionTitle, String electionStatus, long totalVotesCast, List<CandidateResultDto> candidates, CandidateResultDto leadingOrWinner) {
        this.electionId = electionId;
        this.electionTitle = electionTitle;
        this.electionStatus = electionStatus;
        this.totalVotesCast = totalVotesCast;
        this.candidates = candidates;
        this.leadingOrWinner = leadingOrWinner;
    }

    public Long getElectionId() {
        return electionId;
    }

    public void setElectionId(Long electionId) {
        this.electionId = electionId;
    }

    public String getElectionTitle() {
        return electionTitle;
    }

    public void setElectionTitle(String electionTitle) {
        this.electionTitle = electionTitle;
    }

    public String getElectionStatus() {
        return electionStatus;
    }

    public void setElectionStatus(String electionStatus) {
        this.electionStatus = electionStatus;
    }

    public long getTotalVotesCast() {
        return totalVotesCast;
    }

    public void setTotalVotesCast(long totalVotesCast) {
        this.totalVotesCast = totalVotesCast;
    }

    public List<CandidateResultDto> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<CandidateResultDto> candidates) {
        this.candidates = candidates;
    }

    public CandidateResultDto getLeadingOrWinner() {
        return leadingOrWinner;
    }

    public void setLeadingOrWinner(CandidateResultDto leadingOrWinner) {
        this.leadingOrWinner = leadingOrWinner;
    }
}
