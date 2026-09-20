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
@CrossOrigin(origins = "*")
public class ElectionController {

    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @PostMapping
    public ResponseEntity<?> createElection(@Valid @RequestBody ElectionDto dto) {
        try {
            Election election = electionService.createElection(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(election);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Election>> getAllElections() {
        return ResponseEntity.ok(electionService.getAllElections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getElectionById(@PathVariable Long id) {
        return electionService.getElectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Election>> getElectionsByStatus(@PathVariable ElectionStatus status) {
        return ResponseEntity.ok(electionService.getElectionsByStatus(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam ElectionStatus status) {
        try {
            Election updated = electionService.updateElectionStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateElection(@PathVariable Long id, @Valid @RequestBody ElectionDto dto) {
        try {
            Election updated = electionService.updateElection(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
