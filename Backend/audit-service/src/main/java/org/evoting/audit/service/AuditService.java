package org.evoting.audit.service;

import org.evoting.audit.dto.AuditLogDto;
import org.evoting.audit.dto.CreateAuditLogRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuditService {
    AuditLogDto recordAuditLog(CreateAuditLogRequest request);
    Page<AuditLogDto> getAuditLogs(Pageable pageable);
    List<AuditLogDto> getAuditLogsByEntity(String entityType);
    List<AuditLogDto> getAuditLogsByAction(String action);
}
