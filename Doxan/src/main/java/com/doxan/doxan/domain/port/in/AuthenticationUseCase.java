package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.auth.IntrospectRequest;
import com.doxan.doxan.domain.dto.request.auth.LoginRequest;
import com.doxan.doxan.domain.dto.request.auth.LogoutRequest;
import com.doxan.doxan.domain.dto.request.auth.RefreshRequest;
import com.doxan.doxan.domain.dto.response.auth.LoginResponse;
import com.doxan.doxan.domain.dto.response.auth.TokenResponse;

public interface AuthenticationUseCase {
    boolean introspect(IntrospectRequest request);
    LoginResponse authenticate(LoginRequest request);
    TokenResponse refreshToken(RefreshRequest request);
    void logout(LogoutRequest request);
}
