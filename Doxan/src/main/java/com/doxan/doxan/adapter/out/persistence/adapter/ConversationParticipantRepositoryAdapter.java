package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationParticipantEntityId;
import com.doxan.doxan.adapter.out.persistence.mapper.ConversationParticipantMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaConversationParticipantRepository;
import com.doxan.doxan.domain.model.ConversationParticipant;
import com.doxan.doxan.domain.port.out.ConversationParticipantRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ConversationParticipantRepositoryAdapter implements ConversationParticipantRepositoryPort {
    private final JpaConversationParticipantRepository jpaConversationParticipantRepository;
    private final ConversationParticipantMapper conversationParticipantMapper;

    public ConversationParticipantRepositoryAdapter(final JpaConversationParticipantRepository
                                                            jpaConversationParticipantRepository,
                                                    final ConversationParticipantMapper conversationParticipantMapper) {
        this.jpaConversationParticipantRepository = jpaConversationParticipantRepository;
        this.conversationParticipantMapper = conversationParticipantMapper;
    }

    @Override
    public ConversationParticipant save(ConversationParticipant conversationParticipant) {
        return conversationParticipantMapper.toDomain(jpaConversationParticipantRepository
                .save(conversationParticipantMapper.toEntity(conversationParticipant)));
    }

    @Override
    public Optional<ConversationParticipant> findById(String userId, String conversationId) {
        return jpaConversationParticipantRepository.findById(userId, conversationId)
                .map(conversationParticipantMapper::toDomain);
    }

    @Override
    public List<ConversationParticipant> findByConversationId(String conversationId) {
        return jpaConversationParticipantRepository.findByConversationId(conversationId)
                .stream().map(conversationParticipantMapper::toDomain).toList();
    }

    @Override
    public boolean existsById(String userId, String conversationId) {
        return jpaConversationParticipantRepository.existsById(JpaConversationParticipantEntityId.builder()
                        .userId(userId)
                        .conversationId(conversationId)
                .build());
    }

    @Override
    public void deleteById(String userId, String conversationId) {
        jpaConversationParticipantRepository.deleteById(JpaConversationParticipantEntityId.builder()
                        .userId(userId)
                        .conversationId(conversationId)
                        .build());
    }

    @Override
    public long countByConversationId(String conversationId) {
        return jpaConversationParticipantRepository.countConversationParticipantsByConversationId(conversationId);
    }
}
