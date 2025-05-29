package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationEntity;
import com.doxan.doxan.domain.model.enums.ConversationType;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JpaConversationRepository extends JpaRepository<JpaConversationEntity, String> {
    @Query("SELECT c FROM conversations c WHERE c.id in :ids " +
            "AND  c.type = :type ORDER BY c.updatedAt LIMIT :limit OFFSET :offset")
    List<JpaConversationEntity> findByIdsAndType(List<String> ids, ConversationType type, int offset, int limit);

    @Query(value = "SELECT c.* FROM conversations c " +
            "JOIN conversation_partitcipants cp ON c.id = cp.conversation_id " +
            "WHERE cp.user_id = :userId", nativeQuery = true)
    List<JpaConversationEntity> findConversationsByUserId(@Param("userId") String userId);
}
