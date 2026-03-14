package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.mapper.MessageDocumentMapper;
import com.doxan.doxan.adapter.out.persistence.repository.MessageDocumentRepository;
import com.doxan.doxan.domain.model.Message;
import com.doxan.doxan.domain.port.out.MessageRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MessageRepositoryAdapter implements MessageRepositoryPort {
    private final MessageDocumentRepository messageDocumentRepository;
    private final MessageDocumentMapper messageDocumentMapper;

    public MessageRepositoryAdapter(MessageDocumentRepository messageDocumentRepository,
                                    MessageDocumentMapper messageDocumentMapper) {
        this.messageDocumentRepository = messageDocumentRepository;
        this.messageDocumentMapper = messageDocumentMapper;
    }

    @Override
    public Message save(Message message) {
        return messageDocumentMapper.toDomain(messageDocumentRepository
                .save(messageDocumentMapper.toDocument(message)));
    }

    @Override
    public void deleteById(String message) {

    }

    @Override
    public List<Message> findByConversationIdWithPagination(String conversationId, int page, int size) {
        return List.of();
    }
}
