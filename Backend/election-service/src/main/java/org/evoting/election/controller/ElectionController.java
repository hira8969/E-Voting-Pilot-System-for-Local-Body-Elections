package org.evoting.election.controller;

import jakarta.validation.Valid;
import org.evoting.election.dto.ElectionDto;
import org.evoting.election.entity.Election;
import org.evoting.election.entity.ElectionStatus;
import org.evoting.election.service.ElectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @PostMapping
    public ResponseEntity<Election> createElection(@Valid @RequestBody ElectionDto dto) {
        Election election = electionService.createElection(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(election);
    }

    @GetMapping
    public ResponseEntity<List<Election>> getAllElections() {
        return ResponseEntity.ok(electionService.getAllElections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable Long id) {
        return electionService.getElectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Election>> getElectionsByStatus(@PathVariable String status) {
        ElectionStatus parsedStatus = ElectionStatus.fromString(status);
        return ResponseEntity.ok(electionService.getElectionsByStatus(parsedStatus));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Election> updateStatus(@PathVariable Long id, @RequestParam String status) {
        ElectionStatus targetStatus = ElectionStatus.fromString(status);
        Election updated = electionService.updateElectionStatus(id, targetStatus);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Election> updateElection(@PathVariable Long id, @Valid @RequestBody ElectionDto dto) {
        Election updated = electionService.updateElection(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/open")
    public ResponseEntity<Map<String, Object>> isElectionOpen(@PathVariable Long id) {
        boolean open = electionService.isElectionOpenForVoting(id);
        return ResponseEntity.ok(Map.of("electionId", id, "open", open));
    }
}
