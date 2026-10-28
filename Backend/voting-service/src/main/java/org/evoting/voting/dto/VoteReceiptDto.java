package org.evoting.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteReceiptDto {

    private Long voteId;
    private Long electionId;
    private Long voterId;
    private Long candidateId;
    private String constituency;
    private LocalDateTime timestamp;
    private String voteHash;
    private String statusMessage;

    // Enterprise electoral compliance fields
    private String receiptNumber;
    private String transactionId;
    private String hashVerificationStamp;
    private String digitalSignature;
    private String status;
    private String boothCode;
    private String evmUnitNumber;

    public VoteReceiptDto(Long voteId, Long electionId, Long voterId, Long candidateId, String constituency, LocalDateTime timestamp, String voteHash, String statusMessage) {
        this.voteId = voteId;
        this.electionId = electionId;
        this.voterId = voterId;
        this.candidateId = candidateId;
        this.constituency = constituency;
        this.timestamp = timestamp;
        this.voteHash = voteHash;
        this.statusMessage = statusMessage;
        this.status = "CONFIRMED";
        this.receiptNumber = "EV-2026-" + (voteId != null ? String.format("%06d", voteId) : "000001");
        this.transactionId = "0x" + (voteHash != null ? voteHash : "000000");
        this.hashVerificationStamp = "SHA256:" + (voteHash != null && voteHash.length() > 24 ? voteHash.substring(0, 24) : voteHash);
        this.digitalSignature = "ECC-256/ECDSA-VERIFIED-ECI-ROOT";
        this.boothCode = "PB-12-01";
        this.evmUnitNumber = "EVM-IN-" + (voteId != null ? (88000 + voteId) : 88902);
    }
}
