package org.evoting.audit.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.evoting.audit.dto.AuditLogDto;
import org.evoting.audit.dto.CreateAuditLogRequest;
import org.evoting.audit.entity.AuditLog;
import org.evoting.audit.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public AuditLogDto recordAuditLog(CreateAuditLogRequest request) {
        log.info("Auditing action [{}] on entity [{}:{}] by actor [{}]",
                request.getAction(), request.getEntityType(), request.getEntityId(), request.getActorUsername());

        AuditLog logEntity = AuditLog.builder()
                .action(request.getAction())
                .actorId(request.getActorId())
                .actorUsername(request.getActorUsername())
                .actorRole(request.getActorRole())
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .ipAddress(request.getIpAddress())
                .details(request.getDetails())
                .build();

        AuditLog saved = auditLogRepository.save(logEntity);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDto> getAuditLogsByEntity(String entityType) {
        return auditLogRepository.findByEntityTypeOrderByTimestampDesc(entityType)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDto> getAuditLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AuditLogDto mapToDto(AuditLog entity) {
        return AuditLogDto.builder()
                .id(entity.getId())
                .action(entity.getAction())
                .actorId(entity.getActorId())
                .actorUsername(entity.getActorUsername())
                .actorRole(entity.getActorRole())
                .entityType(entity.getEntityType())
                .entityId(entity.getEntityId())
                .ipAddress(entity.getIpAddress())
                .details(entity.getDetails())
                .timestamp(entity.getTimestamp())
                .build();
    }
}
