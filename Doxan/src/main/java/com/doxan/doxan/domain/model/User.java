package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.Gender;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String id;
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private Media profileImage;
    private Media coverImage;
    private Location location;
    private Gender gender;
    private LocalDate dob;
    private LocalDateTime createdAt;
    private Set<Role> roles;
}
