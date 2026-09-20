package org.evoting.voter.controller;

import jakarta.validation.Valid;
import org.evoting.voter.dto.VoterRegistrationDto;
import org.evoting.voter.entity.Voter;
import org.evoting.voter.service.VoterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/voters")
@CrossOrigin(origins = "*")
public class VoterController {

    private final VoterService voterService;

    public VoterController(VoterService voterService) {
        this.voterService = voterService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody VoterRegistrationDto dto) {
        try {
            Voter voter = voterService.registerVoter(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(voter);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Voter>> getAllVoters() {
        return ResponseEntity.ok(voterService.getAllVoters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVoterById(@PathVariable Long id) {
        return voterService.getVoterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/epic/{epicNumber}")
    public ResponseEntity<?> getVoterByEpic(@PathVariable String epicNumber) {
        return voterService.getVoterByEpic(epicNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyVoter(@PathVariable Long id) {
        try {
            Voter verified = voterService.verifyVoter(id);
            return ResponseEntity.ok(verified);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/vote-status")
    public ResponseEntity<?> updateVoteStatus(@PathVariable Long id, @RequestParam boolean hasVoted) {
        try {
            Voter updated = voterService.updateVotingStatus(id, hasVoted);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
