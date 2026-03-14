package com.doxan.doxan.domain.port.out.event;

import com.doxan.doxan.domain.dto.response.message.MessageResponse;

public interface MessageSender {
    void sendMessage(MessageResponse message);
}
