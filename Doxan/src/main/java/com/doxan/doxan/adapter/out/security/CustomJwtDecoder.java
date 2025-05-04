package com.doxan.doxan.adapter.out.security;

import com.doxan.doxan.application.usecase.AuthenticationService;
import com.doxan.doxan.domain.dto.request.auth.IntrospectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    private final String signerKey;
    private final AuthenticationService authenticationService;

    public CustomJwtDecoder(final AuthenticationService authenticationService,
                            @Value("${DOXAN_SIGNER_KEY}") String signerKey) {
        this.authenticationService = authenticationService;
        this.signerKey = signerKey;
    }

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        var success = authenticationService.introspect(IntrospectRequest.builder()
                .token(token).build());
        if (!success) throw new JwtException("invalid token");

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}
