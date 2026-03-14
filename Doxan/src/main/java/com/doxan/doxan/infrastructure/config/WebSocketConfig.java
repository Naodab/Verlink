package com.doxan.doxan.infrastructure.config;

import com.doxan.doxan.adapter.out.websocket.WebSocketSessionHandler;
import com.doxan.doxan.domain.port.in.AuthenticationUseCase;
import com.doxan.doxan.domain.port.in.UserUseCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final AuthenticationUseCase authenticationUseCase;
    private final UserUseCase userUseCase;
    private final ObjectMapper objectMapper;

    public WebSocketConfig(final AuthenticationUseCase authenticationUseCase,
                           final UserUseCase userUseCase,
                           final ObjectMapper objectMapper) {
        this.authenticationUseCase = authenticationUseCase;
        this.userUseCase = userUseCase;
        this.objectMapper = objectMapper;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(new WebSocketSessionHandler(authenticationUseCase,
                        userUseCase, objectMapper), "/websocket")
                .setAllowedOrigins("*");
    }
}
