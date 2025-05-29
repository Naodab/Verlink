package com.doxan.doxan.domain.dto.response.user;

import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubUserResponse {
    String id;
    String username;
    MediaResponse profileImage;
}
