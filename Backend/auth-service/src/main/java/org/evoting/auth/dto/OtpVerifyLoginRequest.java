package org.evoting.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerifyLoginRequest {

    @NotBlank(message = "EPIC number is required")
    private String epicNumber;

    @NotBlank(message = "OTP is required")
    private String otp;
}
