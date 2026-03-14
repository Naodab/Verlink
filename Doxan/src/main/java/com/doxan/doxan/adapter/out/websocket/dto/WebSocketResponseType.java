package com.doxan.doxan.adapter.out.websocket.dto;

public enum WebSocketResponseType {
    CALL,
    AUTH,
    MESSAGE,
    NOTIFICATION,
    VIDEO_CALL;

    @Override
    public String toString() {
        return this.name().toLowerCase().replace('_', '-');
    }
}
