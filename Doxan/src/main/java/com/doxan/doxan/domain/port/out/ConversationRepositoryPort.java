package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Conversation;
import com.doxan.doxan.domain.model.enums.ConversationType;

import java.util.List;
import java.util.Optional;

public interface ConversationRepositoryPort {
    Conversation save(Conversation conversation);
    Optional<Conversation> findById(String id);
    boolean existsById(String id);
    void delete(String id);
    List<Conversation> findByIdsAndType(List<String> ids, ConversationType type, int offset, int limit);
}
