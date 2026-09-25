package org.evoting.voter;

import org.evoting.voter.dto.VoterEligibilityDto;
import org.evoting.voter.dto.VoterRegistrationDto;
import org.evoting.voter.entity.Voter;
import org.evoting.voter.service.VoterService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class VoterServiceTests {

    @Autowired
    private VoterService voterService;

    @Test
    void testRegisterVerifyAndEligibilityFlow() {
        VoterRegistrationDto dto = VoterRegistrationDto.builder()
                .userId(101L)
                .epicNumber("VTR998877")
                .fullName("Alice Smith")
                .email("alice.smith@example.com")
                .phone("9876543210")
                .constituency("North District")
                .build();

        Voter voter = voterService.registerVoter(dto);
        assertNotNull(voter.getId());
        assertFalse(voter.isVerified());
        assertFalse(voter.isHasVoted());

        // Check eligibility prior to verification
        VoterEligibilityDto initialEligibility = voterService.checkEligibility(voter.getId());
        assertFalse(initialEligibility.isEligible());

        // Admin verifies voter
        voterService.verifyVoter(voter.getId());

        // Check eligibility post verification
        VoterEligibilityDto postVerification = voterService.checkEligibility(voter.getId());
        assertTrue(postVerification.isEligible());

        // Mark as voted
        voterService.updateVotingStatus(voter.getId(), true);
        VoterEligibilityDto postVoted = voterService.checkEligibility(voter.getId());
        assertFalse(postVoted.isEligible());
    }
}
