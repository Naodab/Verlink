package com.doxan.doxan.domain.dto.request.message;

import com.doxan.doxan.domain.file.UploadFile;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageOneToOneCreateRequest {
    String content;
    String conversationId;
    String recipientId;
    List<UploadFile> images;
    List<UploadFile> videos;
    List<UploadFile> docs;
}
