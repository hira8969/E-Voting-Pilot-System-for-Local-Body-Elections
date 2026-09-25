package org.evoting.audit.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.evoting.audit.dto.AuditLogDto;
import org.evoting.audit.dto.CreateAuditLogRequest;
import org.evoting.audit.service.AuditService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping("/log")
    public ResponseEntity<AuditLogDto> logEvent(@Valid @RequestBody CreateAuditLogRequest request) {
        AuditLogDto recorded = auditService.recordAuditLog(request);
        return new ResponseEntity<>(recorded, HttpStatus.CREATED);
    }

    @GetMapping("/logs")
    public ResponseEntity<Page<AuditLogDto>> getLogs(@PageableDefault(size = 20) Pageable pageable) {
        Page<AuditLogDto> page = auditService.getAuditLogs(pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/logs/entity/{entityType}")
    public ResponseEntity<List<AuditLogDto>> getLogsByEntity(@PathVariable String entityType) {
        List<AuditLogDto> logs = auditService.getAuditLogsByEntity(entityType);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/logs/action/{action}")
    public ResponseEntity<List<AuditLogDto>> getLogsByAction(@PathVariable String action) {
        List<AuditLogDto> logs = auditService.getAuditLogsByAction(action);
        return ResponseEntity.ok(logs);
    }
}
