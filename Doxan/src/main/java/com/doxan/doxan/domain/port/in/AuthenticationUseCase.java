package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.auth.IntrospectRequest;
import com.doxan.doxan.domain.dto.request.auth.LoginRequest;
import com.doxan.doxan.domain.dto.request.auth.LogoutRequest;
import com.doxan.doxan.domain.dto.request.auth.RefreshRequest;
import com.doxan.doxan.domain.dto.response.auth.LoginResponse;
import com.doxan.doxan.domain.dto.response.auth.TokenResponse;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationUseCase {
    boolean introspect(IntrospectRequest request);
    LoginResponse authenticate(LoginRequest request);
    UserResponse authenticate(IntrospectRequest request) throws ParseException, JOSEException;
    TokenResponse refreshToken(RefreshRequest request);
    void logout(LogoutRequest request);
}
