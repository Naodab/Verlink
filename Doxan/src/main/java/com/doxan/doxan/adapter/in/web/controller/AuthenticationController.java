package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.domain.dto.request.auth.IntrospectRequest;
import com.doxan.doxan.domain.dto.request.auth.LoginRequest;
import com.doxan.doxan.domain.dto.request.auth.LogoutRequest;
import com.doxan.doxan.domain.dto.request.auth.RefreshRequest;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.auth.LoginResponse;
import com.doxan.doxan.domain.dto.response.auth.TokenResponse;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.port.in.AuthenticationUseCase;
import com.nimbusds.jose.JOSEException;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationUseCase authenticationUseCase;

    public AuthenticationController(AuthenticationUseCase authenticationUseCase) {
        this.authenticationUseCase = authenticationUseCase;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.<LoginResponse>builder()
                .data(authenticationUseCase.authenticate(request))
                .build();
    }

    @PostMapping("/me")
    public ApiResponse<UserResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        return ApiResponse.<UserResponse>builder()
                .data(authenticationUseCase.authenticate(request))
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestBody RefreshRequest request) {
        return ApiResponse.<TokenResponse>builder()
                .data(authenticationUseCase.refreshToken(request))
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request) {
        authenticationUseCase.logout(request);
        return ApiResponse.<Void>builder().build();
    }
}
