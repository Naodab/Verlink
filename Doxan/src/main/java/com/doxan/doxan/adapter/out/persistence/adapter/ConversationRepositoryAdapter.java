package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.mapper.ConversationMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaConversationRepository;
import com.doxan.doxan.domain.model.Conversation;
import com.doxan.doxan.domain.model.enums.ConversationType;
import com.doxan.doxan.domain.port.out.ConversationRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ConversationRepositoryAdapter implements ConversationRepositoryPort {
    private final JpaConversationRepository jpaConversationRepository;
    private final ConversationMapper conversationMapper;

    public ConversationRepositoryAdapter(JpaConversationRepository jpaConversationRepository,
                                         ConversationMapper conversationMapper) {
        this.jpaConversationRepository = jpaConversationRepository;
        this.conversationMapper = conversationMapper;
    }

    @Override
    public Conversation save(Conversation conversation) {
        return conversationMapper.toDomain(jpaConversationRepository
                .save(conversationMapper.toEntity(conversation)));
    }

    @Override
    public Optional<Conversation> findById(String id) {
        return jpaConversationRepository.findById(id).map(conversationMapper::toDomain);
    }

    @Override
    public boolean existsById(String id) {
        return jpaConversationRepository.existsById(id);
}

    @Override
    public void delete(String id) {
        jpaConversationRepository.deleteById(id);
    }

    @Override
    public List<Conversation> findByIdsAndType(List<String> ids, ConversationType type, int offset, int limit) {
        return jpaConversationRepository.findByIdsAndType(ids, type, offset, limit).stream()
                .map(conversationMapper::toDomain).toList();
    }
}
