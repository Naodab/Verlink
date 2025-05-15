package com.doxan.doxan.domain.dto.request.post;

import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.model.enums.Visibility;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostCreateRequest {
    String content;
    String targetId;
    Visibility visibility;
    List<UploadFile> images;
    List<UploadFile> videos;
    List<UploadFile> docs;
}
