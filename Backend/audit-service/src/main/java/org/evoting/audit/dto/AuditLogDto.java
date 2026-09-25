package org.evoting.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDto {
    private Long id;
    private String action;
    private Long actorId;
    private String actorUsername;
    private String actorRole;
    private String entityType;
    private String entityId;
    private String ipAddress;
    private String details;
    private LocalDateTime timestamp;
}
