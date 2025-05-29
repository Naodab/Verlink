package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.message.MessageOneToOneCreateRequest;
import com.doxan.doxan.domain.dto.response.message.MessageResponse;

import java.util.List;

public interface MessageUseCase {
    MessageResponse createOneToOneMessage(MessageOneToOneCreateRequest request);
    void deleteById(String id);
    List<MessageResponse> findByConversationIdWithPagination(String conversationId, int offset, int limit);
    List<MessageResponse> searchByContentWithPagination(String conversationId, int offset, int limit);

}