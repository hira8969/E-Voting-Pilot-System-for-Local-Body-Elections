package org.evoting.result.controller;

import org.evoting.result.dto.CandidateResultDto;
import org.evoting.result.dto.ElectionResultResponse;
import org.evoting.result.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<ElectionResultResponse> getElectionResults(@PathVariable("electionId") Long electionId) {
        return ResponseEntity.ok(resultService.getElectionResults(electionId));
    }

    @GetMapping("/election/{electionId}/winner")
    public ResponseEntity<?> getWinner(@PathVariable("electionId") Long electionId) {
        CandidateResultDto winner = resultService.getWinner(electionId);
        if (winner == null) {
            return ResponseEntity.ok(Map.of("message", "No votes or winner declared yet for election " + electionId));
        }
        return ResponseEntity.ok(winner);
    }
}
