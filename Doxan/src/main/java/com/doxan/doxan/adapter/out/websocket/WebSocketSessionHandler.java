package com.doxan.doxan.adapter.out.websocket;

import com.doxan.doxan.adapter.out.websocket.dto.AuthSocketResponse;
import com.doxan.doxan.domain.dto.request.auth.IntrospectRequest;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.port.in.AuthenticationUseCase;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
public class WebSocketSessionHandler extends TextWebSocketHandler {
    private final AuthenticationUseCase authenticationUseCase;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WebSocketSessionHandler(final AuthenticationUseCase authenticationUseCase) {
        this.authenticationUseCase = authenticationUseCase;
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session,
                                     @NonNull TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        String type = jsonNode.get("type").asText();

        if (type.equals("auth")) {
            String token = jsonNode.get("token").asText();
            try {
                UserResponse user = authenticationUseCase.verify(IntrospectRequest.builder()
                        .token(token).build());
                session.getAttributes().put("userId", user.getId());
                WebSocketSessionManager.register(user.getId(), session);
                session.sendMessage(new TextMessage(objectMapper
                        .writeValueAsString(AuthSocketResponse.builder()
                                .success(true)
                                .build())));
                log.info("Connected to user {}", user.getId());
                log.info("Number of connection: {}", WebSocketSessionManager.getCurrentSessions());
            } catch (AppException e) {
                session.sendMessage(new TextMessage(objectMapper
                        .writeValueAsString(AuthSocketResponse.builder()
                                .success(false)
                                .build())));
            }
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session,
                                      @NonNull CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        WebSocketSessionManager.unregister(session.getId());
    }
}