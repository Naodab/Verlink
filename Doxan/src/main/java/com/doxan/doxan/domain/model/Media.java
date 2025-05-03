package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.MediaTargetType;
import com.doxan.doxan.domain.model.enums.MediaType;
import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Media {
    private String id;
    private String targetId;
    private String url;
    private String fileName;
    private String mimeType;
    private MediaType mediaType;
    private MediaTargetType targetType;
}
