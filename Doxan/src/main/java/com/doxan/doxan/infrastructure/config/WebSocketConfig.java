package com.doxan.doxan.infrastructure.config;

import com.doxan.doxan.adapter.out.websocket.WebSocketSessionHandler;
import com.doxan.doxan.domain.port.in.AuthenticationUseCase;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final AuthenticationUseCase authenticationUseCase;

    public WebSocketConfig(final AuthenticationUseCase authenticationUseCase) {
        this.authenticationUseCase = authenticationUseCase;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(new WebSocketSessionHandler(authenticationUseCase), "/websocket")
                .setAllowedOrigins("*");

    }
}
