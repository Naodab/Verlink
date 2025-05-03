package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "groups")
@Table(name = "groups")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaGroupEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    String description;

    @Column(name = "is_private")
    boolean hide;

    @Column(name = "created_at")
    LocalDateTime createdAt;
}
