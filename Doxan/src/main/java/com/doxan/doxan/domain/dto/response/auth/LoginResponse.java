package com.doxan.doxan.domain.dto.response.auth;

import com.doxan.doxan.domain.dto.response.user.UserResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponse {
    UserResponse user;
    String token;
}
