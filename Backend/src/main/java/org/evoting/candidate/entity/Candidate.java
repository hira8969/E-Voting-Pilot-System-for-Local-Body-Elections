package org.evoting.candidate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long electionId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String partyName;

    private String symbolUrl;

    @Column(nullable = false)
    private String constituency;

    @Column(length = 1000)
    private String bio;

    private String manifesto;

    private String nominationStatus = "APPROVED"; // PENDING, APPROVED, REJECTED

    private LocalDateTime createdAt = LocalDateTime.now();

    public Candidate() {
    }

    public Candidate(Long id, Long electionId, String fullName, String partyName, String symbolUrl, String constituency, String bio, String manifesto, String nominationStatus, LocalDateTime createdAt) {
        this.id = id;
        this.electionId = electionId;
        this.fullName = fullName;
        this.partyName = partyName;
        this.symbolUrl = symbolUrl;
        this.constituency = constituency;
        this.bio = bio;
        this.manifesto = manifesto;
        this.nominationStatus = nominationStatus != null ? nominationStatus : "APPROVED";
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
