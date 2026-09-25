package org.evoting.voter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoterEligibilityDto {
    private Long voterId;
    private Long userId;
    private String epicNumber;
    private String fullName;
    private String constituency;
    private boolean verified;
    private boolean hasVoted;
    private boolean eligible;
    private String message;
}
