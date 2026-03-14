package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.document.MessageDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageDocumentRepository extends MongoRepository<MessageDocument, String> {
    List<MessageDocument> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);

    List<MessageDocument> findByConversationIdAndContentRegexIgnoreCase(String conversationId, String keyword);

    long countByConversationIdAndContentRegexIgnoreCase(String conversationId, String keyword);

    @Query("{ $text: { $search: ?1 }, conversationId: ?0 }")
    List<MessageDocument> searchByText(String conversationId, String keyword);

    @Query(value = "{ $text: { $search: ?1 }, conversationId: ?0 }", count = true)
    long countTextSearch(String conversationId, String keyword);
}
