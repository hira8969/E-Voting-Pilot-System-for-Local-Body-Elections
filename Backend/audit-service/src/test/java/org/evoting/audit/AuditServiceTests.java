package org.evoting.audit;

import org.evoting.audit.dto.AuditLogDto;
import org.evoting.audit.dto.CreateAuditLogRequest;
import org.evoting.audit.repository.AuditLogRepository;
import org.evoting.audit.service.AuditService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuditServiceTests {

    @Autowired
    private AuditService auditService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @BeforeEach
    void setUp() {
        auditLogRepository.deleteAll();
    }

    @Test
    void testRecordAuditLogSuccess() {
        CreateAuditLogRequest request = CreateAuditLogRequest.builder()
                .action("BALLOT_CAST")
                .actorId(101L)
                .actorUsername("voter_aarav")
                .actorRole("ROLE_VOTER")
                .entityType("VOTE")
                .entityId("88901")
                .ipAddress("192.168.1.50")
                .details("Cryptographic ballot hash sealed: 0x8f2a9910d5e8")
                .build();

        AuditLogDto recorded = auditService.recordAuditLog(request);

        assertNotNull(recorded);
        assertNotNull(recorded.getId());
        assertNotNull(recorded.getTimestamp());
        assertEquals("BALLOT_CAST", recorded.getAction());
        assertEquals("VOTE", recorded.getEntityType());
        assertEquals("88901", recorded.getEntityId());
        assertEquals("voter_aarav", recorded.getActorUsername());
    }

    @Test
    void testGetAuditLogsByEntityFiltering() {
        auditService.recordAuditLog(CreateAuditLogRequest.builder()
                .action("BALLOT_CAST")
                .entityType("VOTE")
                .entityId("1")
                .build());

        auditService.recordAuditLog(CreateAuditLogRequest.builder()
                .action("ELECTION_CREATED")
                .entityType("ELECTION")
                .entityId("10")
                .build());

        List<AuditLogDto> voteLogs = auditService.getAuditLogsByEntity("VOTE");
        assertEquals(1, voteLogs.size());
        assertEquals("VOTE", voteLogs.get(0).getEntityType());

        List<AuditLogDto> electionLogs = auditService.getAuditLogsByEntity("ELECTION");
        assertEquals(1, electionLogs.size());
        assertEquals("ELECTION", electionLogs.get(0).getEntityType());
    }

    @Test
    void testGetAuditLogsByActionFiltering() {
        auditService.recordAuditLog(CreateAuditLogRequest.builder()
                .action("VOTER_VERIFIED")
                .entityType("VOTER")
                .entityId("501")
                .details("EPIC verified against Bihar Electoral Roll")
                .build());

        List<AuditLogDto> verifiedLogs = auditService.getAuditLogsByAction("VOTER_VERIFIED");
        assertFalse(verifiedLogs.isEmpty());
        assertEquals("VOTER_VERIFIED", verifiedLogs.get(0).getAction());
        assertEquals("VOTER", verifiedLogs.get(0).getEntityType());
    }
}
