package org.evoting.voting.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "voter-service", url = "${services.voter-service.url:}")
public interface VoterClient {

    @GetMapping("/api/voters/{id}/eligibility")
    ResponseEntity<Map<String, Object>> checkEligibility(@PathVariable("id") Long id);

    @PutMapping("/api/voters/{id}/vote-status")
    ResponseEntity<Void> updateVoteStatus(@PathVariable("id") Long id, @RequestParam("hasVoted") boolean hasVoted);
}
