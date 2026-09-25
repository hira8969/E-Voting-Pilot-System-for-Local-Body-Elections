package org.evoting.audit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAuditLogRequest {

    @NotBlank(message = "Action cannot be blank")
    private String action;

    private Long actorId;
    private String actorUsername;
    private String actorRole;

    @NotBlank(message = "Entity type cannot be blank")
    private String entityType;

    private String entityId;
    private String ipAddress;
    private String details;
}
