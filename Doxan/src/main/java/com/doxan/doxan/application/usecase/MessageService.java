package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.ConversationParticipantDTOMapper;
import com.doxan.doxan.domain.dto.mapper.MediaDTOMapper;
import com.doxan.doxan.domain.dto.mapper.MessageDTOMapper;
import com.doxan.doxan.domain.dto.request.UploadFileRequest;
import com.doxan.doxan.domain.dto.request.message.MessageOneToOneCreateRequest;
import com.doxan.doxan.domain.dto.response.UploadFileResponse;
import com.doxan.doxan.domain.dto.response.message.MessageResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.*;
import com.doxan.doxan.domain.model.enums.ConversationType;
import com.doxan.doxan.domain.model.enums.MediaTargetType;
import com.doxan.doxan.domain.model.enums.MessageStatus;
import com.doxan.doxan.domain.port.in.MessageUseCase;
import com.doxan.doxan.domain.port.out.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class MessageService implements MessageUseCase {
    private final MessageSender messageSender;
    private final MediaDTOMapper mediaDTOMapper;
    private final MessageDTOMapper messageDTOMapper;
    private final UserRepositoryPort userRepository;
    private final UploadFileService uploadFileService;
    private final MessageRepositoryPort messageRepository;
    private final ConversationRepositoryPort conversationRepository;
    private final ConversationParticipantDTOMapper conversationParticipantDTOMapper;
    private final ConversationParticipantRepositoryPort conversationParticipantRepository;

    public MessageService(final MessageRepositoryPort messageRepository,
                          final ConversationRepositoryPort conversationRepository,
                          final UserRepositoryPort userRepository,
                          final MessageDTOMapper messageDTOMapper,
                          final ConversationParticipantRepositoryPort conversationParticipantRepository,
                          final ConversationParticipantDTOMapper conversationParticipantDTOMapper,
                          final UploadFileService uploadFileService,
                          final MediaDTOMapper mediaDTOMapper,
                          final MessageSender messageSender) {
        this.userRepository = userRepository;
        this.messageDTOMapper = messageDTOMapper;
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.conversationParticipantRepository = conversationParticipantRepository;
        this.conversationParticipantDTOMapper = conversationParticipantDTOMapper;
        this.uploadFileService = uploadFileService;
        this.mediaDTOMapper = mediaDTOMapper;
        this.messageSender = messageSender;
    }

    @Override
    @Transactional
    public MessageResponse createOneToOneMessage(MessageOneToOneCreateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info(userId);
        ConversationParticipant senderParticipant;
        List<ConversationParticipant> recipients = new ArrayList<>();
        Message message = messageDTOMapper.fromCreateRequest(request);
        if (request.getConversationId() != null) {
            senderParticipant = conversationParticipantRepository.findById(userId,
                            request.getConversationId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_BELONG_TO_CONVERSATION));
            recipients.add(conversationParticipantRepository.findById(
                    request.getRecipientId(),
                    request.getConversationId()
            ).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_BELONG_TO_CONVERSATION)));
        } else {
            User sender = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            User recipient = userRepository.findById(request.getRecipientId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            Conversation conversation = conversationRepository.save(Conversation.builder()
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .type(ConversationType.ONE_TO_ONE)
                    .build());

            senderParticipant = conversationParticipantRepository.save(
                    ConversationParticipant.builder()
                            .conversation(conversation)
                            .user(sender)
                            .name(sender.getUsername())
                            .joinedAt(LocalDateTime.now())
                            .build()
            );

            recipients.add(conversationParticipantRepository.save(
                    ConversationParticipant.builder()
                            .conversation(conversation)
                            .user(recipient)
                            .name(recipient.getUsername())
                            .joinedAt(LocalDateTime.now())
                            .build()
            ));
        }

        String messageId = UUID.randomUUID().toString();
        UploadFileResponse uploadFileResponse = uploadFileService.uploadFile(messageId, UploadFileRequest.builder()
                    .images(Optional.ofNullable(request.getImages()).orElse(List.of()))
                    .videos(Optional.ofNullable(request.getVideos()).orElse(List.of()))
                    .docs(Optional.ofNullable(request.getDocs()).orElse(List.of()))
                .build(), MediaTargetType.MESSAGE);

        message.setSenderId(userId);
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        message.setStatus(MessageStatus.SENT);

        List<Media> medias = new ArrayList<>();
        medias.addAll(Optional.ofNullable(uploadFileResponse.getVideos()).orElse(List.of()).stream()
                .map(mediaDTOMapper::fromResponse).toList());
        medias.addAll(Optional.ofNullable(uploadFileResponse.getImages()).orElse(List.of()).stream()
                .map(mediaDTOMapper::fromResponse).toList());
        medias.addAll(Optional.ofNullable(uploadFileResponse.getDocs()).orElse(List.of()).stream()
                .map(mediaDTOMapper::fromResponse).toList());
        message.setMedias(medias);

        MessageResponse response = messageDTOMapper.toResponse(messageRepository.save(message));
        response.setSender(conversationParticipantDTOMapper.toResponse(senderParticipant));
        response.setDocs(uploadFileResponse.getDocs());
        response.setImages(uploadFileResponse.getImages());
        response.setVideos(uploadFileResponse.getVideos());

        response.setRecipients(recipients.stream()
                .map(conversationParticipantDTOMapper::toResponse).toList());

        messageSender.sendMessage(response);
        return response;
    }

    @Override
    public void deleteById(String id) {
        messageRepository.deleteById(id);
    }

    @Override
    public List<MessageResponse> findByConversationIdWithPagination(String conversationId, int offset, int limit) {
        return List.of();
    }

    @Override
    public List<MessageResponse> searchByContentWithPagination(String conversationId, int offset, int limit) {
        return List.of();
    }
}
