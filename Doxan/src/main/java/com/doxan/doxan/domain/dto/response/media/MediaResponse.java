package com.doxan.doxan.domain.dto.response.media;

import com.doxan.doxan.domain.model.enums.MediaType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaResponse {
    String id;
    String url;
    String fileName;
    String mimeType;
    MediaType mediaType;
}