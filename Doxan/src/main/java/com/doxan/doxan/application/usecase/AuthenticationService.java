package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.UserDTOMapper;
import com.doxan.doxan.domain.dto.request.auth.IntrospectRequest;
import com.doxan.doxan.domain.dto.request.auth.LoginRequest;
import com.doxan.doxan.domain.dto.request.auth.LogoutRequest;
import com.doxan.doxan.domain.dto.request.auth.RefreshRequest;
import com.doxan.doxan.domain.dto.response.auth.LoginResponse;
import com.doxan.doxan.domain.dto.response.auth.TokenResponse;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.InvalidatedToken;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.port.in.AuthenticationUseCase;
import com.doxan.doxan.domain.port.out.InvalidatedTokenRepositoryPort;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import com.doxan.doxan.domain.port.security.PasswordEncoder;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
public class AuthenticationService implements AuthenticationUseCase {
    private final UserRepositoryPort  userRepository;
    private final InvalidatedTokenRepositoryPort tokenRepository;
    private final PasswordEncoder passwordEncoder;

    private final String signerKey;
    private final long validDuration;
    private final long refreshableDuration;
    private final UserDTOMapper userDTOMapper;

    public AuthenticationService(final UserRepositoryPort userRepository,
                                 final InvalidatedTokenRepositoryPort tokenRepository,
                                 final PasswordEncoder passwordEncoder,
                                 final Dotenv dotenv,
                                 UserDTOMapper userDTOMapper) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;

        this.signerKey = dotenv.get("DOXAN_SIGNER_KEY");
        this.validDuration = Long.parseLong(dotenv.get("DOXAN_VALIDATION_DURATION"));
        this.refreshableDuration =  Long.parseLong(dotenv.get("DOXAN_REFRESHABLE_DURATION"));
        this.userDTOMapper = userDTOMapper;
    }

    @Override
    public boolean introspect(final IntrospectRequest request) {
        try {
            verifyToken(request.getToken(), false);
            return true;
        } catch (AppException | ParseException | JOSEException e) {
            return false;
        }
    }

    @Override
    public LoginResponse authenticate(final LoginRequest request) {
        User user = userRepository.findByEmail(request.getUsername())
                .or(() -> userRepository.findByPhone(request.getUsername()))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        log.info(user.getProfileImage().getUrl());
        UserResponse response = userDTOMapper.toResponse(user);
        log.info(response.getProfileImage().getUrl());

        return LoginResponse.builder()
                .user(userDTOMapper.toResponse(user))
                .token(generateToken(user))
                .build();
    }

    @Override
    public TokenResponse refreshToken(final RefreshRequest request) {
        try {
            SignedJWT signedJWT = saveInvalidToken(request.getToken());
            User user = userRepository.findById(signedJWT.getJWTClaimsSet().getSubject())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            return TokenResponse.builder().token(generateToken(user)).build();
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private SignedJWT saveInvalidToken(String token) throws JOSEException, ParseException {
        SignedJWT signedJWT = verifyToken(token, true);

        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .jit(jit)
                .expireTime(expiration.toInstant()
                        .atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();
        tokenRepository.save(invalidatedToken);
        return signedJWT;
    }

    @Override
    public void logout(LogoutRequest request) {
        try {
            saveInvalidToken(request.getToken());
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private SignedJWT verifyToken(final String token, final boolean isRefresh)
            throws JOSEException, ParseException {
        JWSVerifier verifier =  new MACVerifier(signerKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = isRefresh
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                    .toInstant()
                    .plus(refreshableDuration, ChronoUnit.SECONDS)
                    .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        if (!(verified && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (tokenRepository.existsByJit(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    private String generateToken(final User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("doxan.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(validDuration, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private String buildScope(final User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission ->
                            stringJoiner.add(permission.getName()));
                }
            });
        }
        return stringJoiner.toString();
    }
}
