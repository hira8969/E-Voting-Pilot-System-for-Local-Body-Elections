package org.evoting.candidate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CandidateDto {

    @NotNull(message = "Election ID is required")
    private Long electionId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Party name is required")
    private String partyName;

    private String symbolUrl;

    @NotBlank(message = "Constituency is required")
    private String constituency;

    private String bio;

    private String manifesto;

    private String nominationStatus = "APPROVED";

    public CandidateDto() {
    }

    public CandidateDto(Long electionId, String fullName, String partyName, String symbolUrl, String constituency, String bio, String manifesto, String nominationStatus) {
        this.electionId = electionId;
        this.fullName = fullName;
        this.partyName = partyName;
        this.symbolUrl = symbolUrl;
        this.constituency = constituency;
        this.bio = bio;
        this.manifesto = manifesto;
        this.nominationStatus = nominationStatus != null ? nominationStatus : "APPROVED";
    }

    public Long getElectionId() {
        return electionId;
    }

    public void setElectionId(Long electionId) {
        this.electionId = electionId;
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getManifesto() {
        return manifesto;
    }

    public void setManifesto(String manifesto) {
        this.manifesto = manifesto;
    }

    public String getNominationStatus() {
        return nominationStatus;
    }

    public void setNominationStatus(String nominationStatus) {
        this.nominationStatus = nominationStatus;
    }
}
