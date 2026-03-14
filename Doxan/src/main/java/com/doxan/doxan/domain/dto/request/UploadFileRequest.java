package com.doxan.doxan.domain.dto.request;

import com.doxan.doxan.domain.file.UploadFile;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UploadFileRequest {
    List<UploadFile> images;
    List<UploadFile> videos;
    List<UploadFile> docs;
}
