package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Message;

import java.util.List;

public interface MessageRepositoryPort {
    Message save(Message message);
    void deleteById(String message);
    List<Message> findByConversationIdWithPagination(String conversationId, int page, int size);

}
