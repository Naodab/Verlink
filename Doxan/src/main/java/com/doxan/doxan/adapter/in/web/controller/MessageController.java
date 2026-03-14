package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.adapter.out.fileupload.SpringUploadFile;
import com.doxan.doxan.domain.dto.request.message.MessageOneToOneCreateRequest;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.message.MessageResponse;
import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.port.in.MessageUseCase;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageUseCase messageUseCase;

    public MessageController(final MessageUseCase messageUseCase) {
        this.messageUseCase = messageUseCase;
    }

    @PostMapping("/to-one")
    public ApiResponse<MessageResponse> createOneToOneMessage(
            @RequestParam(value = "content", required = false) String content,
            @RequestParam("recipientId") String recipientId,
            @RequestParam(value = "conversationId", required = false) String conversationId,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "videos", required = false) List<MultipartFile> videos,
            @RequestParam(value = "docs", required = false) List<MultipartFile> docs
    ) {
        MessageOneToOneCreateRequest request = MessageOneToOneCreateRequest.builder()
                .content(content)
                .recipientId(recipientId)
                .conversationId(conversationId)
                .build();
        if (images != null && !images.isEmpty()) {
            request.setImages(images.stream().map(image -> (UploadFile) new SpringUploadFile(image)).toList());
        }
        if (videos != null && !videos.isEmpty()) {
            request.setImages(videos.stream().map(video -> (UploadFile) new SpringUploadFile(video)).toList());
        }
        if (docs != null && !docs.isEmpty()) {
            request.setImages(docs.stream().map(image -> (UploadFile) new SpringUploadFile(image)).toList());
        }
        return ApiResponse.<MessageResponse>builder()
                .data(messageUseCase.createOneToOneMessage(request))
                .build();
    }
}
