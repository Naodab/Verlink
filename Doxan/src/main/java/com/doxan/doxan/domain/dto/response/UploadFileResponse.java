package com.doxan.doxan.domain.dto.response;

import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UploadFileResponse {
    List<MediaResponse> images;
    List<MediaResponse> videos;
    List<MediaResponse> docs;
}
