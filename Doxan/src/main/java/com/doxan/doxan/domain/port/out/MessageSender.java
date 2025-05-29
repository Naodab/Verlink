package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.dto.response.message.MessageResponse;

public interface MessageSender {
    void sendMessage(MessageResponse message);
}
