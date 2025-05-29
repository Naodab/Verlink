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
public class ParticipantConversationResponse {
    String id;
    String username;
    String nickname;
    MediaResponse profileImage;
}
