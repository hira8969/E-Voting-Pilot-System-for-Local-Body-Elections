package org.evoting.result.dto.external;

public class ElectionDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String electionType;

    public ElectionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getElectionType() { return electionType; }
    public void setElectionType(String electionType) { this.electionType = electionType; }
}
