package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationParticipantEntity;
import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationParticipantEntityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JpaConversationParticipantRepository extends
        JpaRepository<JpaConversationParticipantEntity, JpaConversationParticipantEntityId> {
    @Query("SELECT cp FROM conversation_participants cp WHERE cp.id.conversationId = :conversationId")
    List<JpaConversationParticipantEntity> findByConversationId(String conversationId);

    @Query("SELECT COUNT(cp) FROM conversation_participants cp WHERE cp.id.conversationId = :conversationId")
    long countConversationParticipantsByConversationId(String conversationId);
}
