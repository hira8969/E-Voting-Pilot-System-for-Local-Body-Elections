package org.evoting.election.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.evoting.election.entity.ElectionStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectionDto {

    @NotBlank(message = "Election title is required")
    private String title;

    private String description;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @Builder.Default
    private ElectionStatus status = ElectionStatus.DRAFT;

    @NotBlank(message = "Election type is required")
    private String electionType;

    private String constituency;

    private String ward;
}
