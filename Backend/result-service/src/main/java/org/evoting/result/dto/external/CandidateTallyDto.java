package org.evoting.result.dto.external;

public class CandidateTallyDto {
    private Long candidateId;
    private Long voteCount;

    public CandidateTallyDto() {}

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }
    public Long getVoteCount() { return voteCount; }
    public void setVoteCount(Long voteCount) { this.voteCount = voteCount; }
}
