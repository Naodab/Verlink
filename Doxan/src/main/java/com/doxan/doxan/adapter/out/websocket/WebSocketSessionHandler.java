package com.doxan.doxan.adapter.out.websocket;

import com.doxan.doxan.adapter.out.websocket.dto.AuthSocketResponse;
import com.doxan.doxan.adapter.out.websocket.dto.WebSocketResponse;
import com.doxan.doxan.adapter.out.websocket.dto.WebSocketResponseType;
import com.doxan.doxan.domain.dto.request.auth.IntrospectRequest;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.model.enums.ActivityState;
import com.doxan.doxan.domain.port.in.AuthenticationUseCase;
import com.doxan.doxan.domain.port.in.UserUseCase;
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
    private final UserUseCase userUseCase;
    private final ObjectMapper objectMapper;

    private static final String USER_ID = "userId";
    private static final String USER_ACTIVITY_STATE = "userActivityState";

    public WebSocketSessionHandler(final AuthenticationUseCase authenticationUseCase,
                                   final UserUseCase userUseCase,
                                   final ObjectMapper objectMapper) {
        this.authenticationUseCase = authenticationUseCase;
        this.userUseCase = userUseCase;
        this.objectMapper = objectMapper;
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
                session.getAttributes().put(USER_ID, user.getId());
                WebSocketSessionManager.register(user.getId(), session);
                ActivityState activityState = ActivityState.ONLINE;
                if (!ActivityState.TURN_OFF.equals(user.getActivityState()))
                    userUseCase.changeActivityState(user.getId(), activityState);
                else
                    activityState = ActivityState.TURN_OFF;
                session.getAttributes().put(USER_ACTIVITY_STATE, activityState);
                session.sendMessage(new TextMessage(objectMapper
                        .writeValueAsString(WebSocketResponse.<AuthSocketResponse>builder()
                                .data(AuthSocketResponse.builder()
                                        .success(true)
                                        .build())
                                .build())));
                log.info("Connected to user {}", user.getId());
                log.info("Number of connection: {}", WebSocketSessionManager.getCurrentSessions());
            } catch (AppException e) {
                session.sendMessage(new TextMessage(objectMapper
                        .writeValueAsString(WebSocketResponse.<AuthSocketResponse>builder()
                                .type(WebSocketResponseType.AUTH.toString())
                                .data(AuthSocketResponse.builder()
                                        .success(false)
                                        .build())
                                .build())));
            }
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session,
                                      @NonNull CloseStatus status) throws Exception {
        ActivityState activityState = ActivityState.valueOf(session.getAttributes().get(USER_ACTIVITY_STATE).toString());
        String userId = session.getAttributes().get(USER_ID).toString();
        if (!ActivityState.TURN_OFF.equals(activityState)) {
            userUseCase.changeActivityState(userId, ActivityState.OFFLINE);
        }
        super.afterConnectionClosed(session, status);
        WebSocketSessionManager.unregister(userId);
    }
}