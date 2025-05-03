package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "permissions")
@Entity(name = "permissions")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaPermissionEntity {
    @Id
    String name;
    String description;
}
