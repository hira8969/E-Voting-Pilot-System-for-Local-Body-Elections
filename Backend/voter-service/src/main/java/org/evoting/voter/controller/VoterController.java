package org.evoting.voter.controller;

import jakarta.validation.Valid;
import org.evoting.voter.dto.VoterEligibilityDto;
import org.evoting.voter.dto.VoterRegistrationDto;
import org.evoting.voter.entity.Voter;
import org.evoting.voter.service.VoterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voters")
public class VoterController {

    private final VoterService voterService;

    public VoterController(VoterService voterService) {
        this.voterService = voterService;
    }

    @PostMapping("/register")
    public ResponseEntity<Voter> register(@Valid @RequestBody VoterRegistrationDto dto) {
        Voter voter = voterService.registerVoter(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(voter);
    }

    @GetMapping
    public ResponseEntity<List<Voter>> getAllVoters() {
        return ResponseEntity.ok(voterService.getAllVoters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voter> getVoterById(@PathVariable Long id) {
        return voterService.getVoterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Voter> getVoterByUserId(@PathVariable Long userId) {
        return voterService.getVoterByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/epic/{epicNumber}")
    public ResponseEntity<Voter> getVoterByEpic(@PathVariable String epicNumber) {
        return voterService.getVoterByEpic(epicNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/eligibility")
    public ResponseEntity<VoterEligibilityDto> checkEligibility(@PathVariable Long id) {
        VoterEligibilityDto eligibility = voterService.checkEligibility(id);
        return ResponseEntity.ok(eligibility);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Voter> verifyVoter(@PathVariable Long id) {
        Voter verified = voterService.verifyVoter(id);
        return ResponseEntity.ok(verified);
    }

    @PutMapping("/{id}/vote-status")
    public ResponseEntity<Voter> updateVoteStatus(@PathVariable Long id, @RequestParam boolean hasVoted) {
        Voter updated = voterService.updateVotingStatus(id, hasVoted);
        return ResponseEntity.ok(updated);
    }
}
