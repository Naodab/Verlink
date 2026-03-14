package com.doxan.doxan.adapter.out.mongo;

import jakarta.annotation.PostConstruct;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import org.springframework.stereotype.Component;

@Component
public class MongoIndexInitializer {
    private final MongoTemplate mongoTemplate;

    public MongoIndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void initIndexes() {
        Index index = new Index()
                .on("conversationId", Sort.Direction.ASC)
                .on("createdAt", Sort.Direction.DESC)
                .named("conversation_createdAt_idx");

        mongoTemplate.indexOps("messages").ensureIndex(index);

        TextIndexDefinition textIndex = new TextIndexDefinition.TextIndexDefinitionBuilder()
                .onField("content")
                .named("content_text_idx")
                .build();

        mongoTemplate.indexOps("messages").ensureIndex(textIndex);
    }
}
