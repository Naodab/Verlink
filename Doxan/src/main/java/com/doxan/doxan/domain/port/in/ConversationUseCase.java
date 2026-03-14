package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.conversation.ConversationCreateRequest;
import com.doxan.doxan.domain.dto.request.conversation.ConversationUpdateRequest;
import com.doxan.doxan.domain.dto.request.conversation.GroupConversationCreateRequest;
import com.doxan.doxan.domain.dto.response.conversation.ConversationResponse;

import java.util.List;

public interface ConversationUseCase {
    ConversationResponse create(ConversationCreateRequest request);
    ConversationResponse create(GroupConversationCreateRequest request);
    ConversationResponse findById(String conversationId);
    ConversationResponse update(String conversationId, ConversationUpdateRequest request);
    List<ConversationResponse> findByUserId(String userId, int offset, int limit);
    void deleteById(String conversationId);
}
