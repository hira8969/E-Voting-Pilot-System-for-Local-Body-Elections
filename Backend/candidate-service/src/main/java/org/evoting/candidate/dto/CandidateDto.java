package org.evoting.candidate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @Builder.Default
    private String nominationStatus = "APPROVED";
}
