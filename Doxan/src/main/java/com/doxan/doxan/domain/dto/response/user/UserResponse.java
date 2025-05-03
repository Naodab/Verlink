package com.doxan.doxan.domain.dto.response.user;

import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import com.doxan.doxan.domain.model.enums.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String email;
    String firstName;
    String lastName;
    String phone;
    LocationResponse location;
    Gender gender;
    LocalDate dob;
    LocalDateTime createdAt;
    MediaResponse profileImage;
    MediaResponse coverImage;
}
