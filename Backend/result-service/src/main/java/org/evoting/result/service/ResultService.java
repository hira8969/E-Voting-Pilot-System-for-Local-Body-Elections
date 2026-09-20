package org.evoting.result.service;

import org.evoting.result.dto.CandidateResultDto;
import org.evoting.result.dto.ElectionResultResponse;
import org.evoting.result.dto.external.CandidateDto;
import org.evoting.result.dto.external.CandidateTallyDto;
import org.evoting.result.dto.external.ElectionDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final RestTemplate restTemplate;

    @Value("${services.voting-service.url:http://localhost:8084}")
    private String votingServiceUrl;

    @Value("${services.candidate-service.url:http://localhost:8083}")
    private String candidateServiceUrl;

    @Value("${services.election-service.url:http://localhost:8082}")
    private String electionServiceUrl;

    public ResultService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ElectionResultResponse getElectionResults(Long electionId) {
        // 1. Fetch Election details
        ElectionDto election = null;
        try {
            election = restTemplate.getForObject(electionServiceUrl + "/api/elections/" + electionId, ElectionDto.class);
        } catch (Exception ignored) {}

        String title = election != null ? election.getTitle() : "Election #" + electionId;
        String status = election != null ? election.getStatus() : "UNKNOWN";

        // 2. Fetch Candidates
        List<CandidateDto> candidates = new ArrayList<>();
        try {
            CandidateDto[] candidateArray = restTemplate.getForObject(
                    candidateServiceUrl + "/api/candidates/election/" + electionId,
                    CandidateDto[].class
            );
            if (candidateArray != null) {
                candidates = Arrays.asList(candidateArray);
            }
        } catch (Exception ignored) {}

        // 3. Fetch Tallies from Voting Service
        Map<Long, Long> tallyMap = new HashMap<>();
        try {
            CandidateTallyDto[] tallies = restTemplate.getForObject(
                    votingServiceUrl + "/api/votes/election/" + electionId + "/tallies",
                    CandidateTallyDto[].class
            );
            if (tallies != null) {
                for (CandidateTallyDto tally : tallies) {
                    tallyMap.put(tally.getCandidateId(), tally.getVoteCount());
                }
            }
        } catch (Exception ignored) {}

        // 4. Calculate total votes
        long totalVotes = tallyMap.values().stream().mapToLong(Long::longValue).sum();

        // 5. Build candidate results list
        List<CandidateResultDto> candidateResults = new ArrayList<>();
        for (CandidateDto candidate : candidates) {
            long votes = tallyMap.getOrDefault(candidate.getId(), 0L);
            double percentage = totalVotes > 0 ? ((double) votes / totalVotes) * 100.0 : 0.0;
            // Round to 2 decimal places
            percentage = Math.round(percentage * 100.0) / 100.0;

            candidateResults.add(new CandidateResultDto(
                    candidate.getId(),
                    candidate.getFullName(),
                    candidate.getPartyName(),
                    candidate.getSymbolUrl(),
                    candidate.getConstituency(),
                    votes,
                    percentage
            ));
        }

        // Sort descending by vote count
        candidateResults.sort((a, b) -> Long.compare(b.getVoteCount(), a.getVoteCount()));

        CandidateResultDto winner = candidateResults.isEmpty() || totalVotes == 0 ? null : candidateResults.get(0);

        return new ElectionResultResponse(
                electionId,
                title,
                status,
                totalVotes,
                candidateResults,
                winner
        );
    }

    public CandidateResultDto getWinner(Long electionId) {
        ElectionResultResponse response = getElectionResults(electionId);
        return response.getLeadingOrWinner();
    }
}
