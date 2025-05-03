package com.doxan.doxan.domain.dto.request.user;

import com.doxan.doxan.adapter.in.web.annotation.ValidPhoneNumber;
import com.doxan.doxan.domain.model.enums.Gender;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String username;

    @Email
    String email;
    String password;
    String firstName;
    String lastName;

    @ValidPhoneNumber
    String phone;
    LocationRequest location;
    Gender gender;
    LocalDate dob;
}
