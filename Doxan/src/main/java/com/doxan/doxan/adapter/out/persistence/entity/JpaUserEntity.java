package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.Gender;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Entity(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaUserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String username;

    @Column(unique = true)
    String email;
    String password;

    @Column(name = "first_name")
    String firstName;

    @Column(name = "last_name")
    String lastName;

    @Column(unique = true)
    String phone;

    @Enumerated(EnumType.STRING)
    Gender gender;
    LocalDate dob;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL)
    JpaLocationEntity location;

    @ManyToMany
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<JpaRoleEntity> roles;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_image", referencedColumnName = "id")
    JpaMediaEntity profileImage;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cover_image", referencedColumnName = "id")
    JpaMediaEntity coverImage;
}
