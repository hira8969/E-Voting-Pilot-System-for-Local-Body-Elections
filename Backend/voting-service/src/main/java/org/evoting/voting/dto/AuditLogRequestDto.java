package org.evoting.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRequestDto {
    private String action;
    private Long actorId;
    private String actorUsername;
    private String actorRole;
    private String entityType;
    private String entityId;
    private String ipAddress;
    private String details;
}
