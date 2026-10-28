package org.evoting.candidate.controller;

import jakarta.validation.Valid;
import org.evoting.candidate.dto.CandidateDto;
import org.evoting.candidate.entity.Candidate;
import org.evoting.candidate.service.CandidateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping
    public ResponseEntity<Candidate> addCandidate(@Valid @RequestBody CandidateDto dto) {
        Candidate candidate = candidateService.addCandidate(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(candidate);
    }

    @GetMapping
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable("id") Long id) {
        return candidateService.getCandidateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<Candidate>> getCandidatesByElection(@PathVariable("electionId") Long electionId) {
        return ResponseEntity.ok(candidateService.getCandidatesByElection(electionId));
    }

    @GetMapping("/election/{electionId}/constituency/{constituency}")
    public ResponseEntity<List<Candidate>> getCandidatesByElectionAndConstituency(
            @PathVariable("electionId") Long electionId,
            @PathVariable("constituency") String constituency) {
        return ResponseEntity.ok(candidateService.getCandidatesByElectionAndConstituency(electionId, constituency));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidate> updateCandidate(@PathVariable("id") Long id, @Valid @RequestBody CandidateDto dto) {
        Candidate updated = candidateService.updateCandidate(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable("id") Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }
}
