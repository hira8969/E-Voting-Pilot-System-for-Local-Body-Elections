package org.evoting.result.dto;

public class CandidateResultDto {

    private Long candidateId;
    private String fullName;
    private String partyName;
    private String symbolUrl;
    private String constituency;
    private long voteCount;
    private double votePercentage;

    public CandidateResultDto() {
    }

    public CandidateResultDto(Long candidateId, String fullName, String partyName, String symbolUrl, String constituency, long voteCount, double votePercentage) {
        this.candidateId = candidateId;
        this.fullName = fullName;
        this.partyName = partyName;
        this.symbolUrl = symbolUrl;
        this.constituency = constituency;
        this.voteCount = voteCount;
        this.votePercentage = votePercentage;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPartyName() {
        return partyName;
    }

    public void setPartyName(String partyName) {
        this.partyName = partyName;
    }

    public String getSymbolUrl() {
        return symbolUrl;
    }

    public void setSymbolUrl(String symbolUrl) {
        this.symbolUrl = symbolUrl;
    }

    public String getConstituency() {
        return constituency;
    }

    public void setConstituency(String constituency) {
        this.constituency = constituency;
    }

    public long getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(long voteCount) {
        this.voteCount = voteCount;
    }

    public double getVotePercentage() {
        return votePercentage;
    }

    public void setVotePercentage(double votePercentage) {
        this.votePercentage = votePercentage;
    }
}
