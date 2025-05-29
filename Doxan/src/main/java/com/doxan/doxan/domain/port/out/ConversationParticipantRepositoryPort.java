package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.ConversationParticipant;

import java.util.List;
import java.util.Optional;

public interface ConversationParticipantRepositoryPort {
    ConversationParticipant save(ConversationParticipant conversationParticipant);
    Optional<ConversationParticipant> findById(String userId, String conversationId);
    List<ConversationParticipant> findByConversationId(String conversationId);
    boolean existsById(String userId, String conversationId);
    void deleteById(String userId, String conversationId);
    long countByConversationId(String conversationId);
}
