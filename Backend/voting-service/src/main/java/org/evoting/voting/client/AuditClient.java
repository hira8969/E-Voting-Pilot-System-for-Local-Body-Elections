package org.evoting.voting.client;

import org.evoting.voting.dto.AuditLogRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "audit-service", url = "${services.audit-service.url:}")
public interface AuditClient {

    @PostMapping("/api/audit/log")
    ResponseEntity<Map<String, Object>> logEvent(@RequestBody AuditLogRequestDto request);
}
