package com.doxan.doxan.domain.dto.request.user;

import com.doxan.doxan.adapter.in.web.annotation.ValidDateOfBirth;
import com.doxan.doxan.adapter.in.web.annotation.ValidPhoneNumber;
import com.doxan.doxan.domain.model.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    String username;

    @Size(min = 6, max = 20, message = "INVALID_PASSWORD")
    String password;

    @Email
    String email;

    String firstName;
    String lastName;
    Gender gender;
    LocationRequest location;

    @ValidDateOfBirth(min = 16, message = "INVALID_DATE_OF_BIRTH")
    LocalDate dob;

    @ValidPhoneNumber(message = "INVALID_PHONE_NUMBER")
    String phone;
}
