package com.doxan.doxan.adapter.out.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class WebSocketSessionManager {
    private WebSocketSessionManager() {}

    private static final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public static void register(String userId, WebSocketSession session) {
        log.info("User {} registered", userId);
        sessions.put(userId, session);
    }

    public static void unregister(String userId) {
        sessions.remove(userId);
    }

    public static void unregisterBySession(WebSocketSession session) {
        sessions.entrySet().removeIf(entry -> entry.getValue().getId().equals(session.getId()));
    }

    public static WebSocketSession getSession(String userId) {
        return sessions.get(userId);
    }

    public static long getCurrentSessions() {
        return sessions.size();
    }
}
