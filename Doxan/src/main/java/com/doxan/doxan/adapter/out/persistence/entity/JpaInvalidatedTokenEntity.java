package com.doxan.doxan.adapter.out.persistence.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "invalidated_tokens")
@Entity(name = "invalidated_tokens")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaInvalidatedTokenEntity {
    @Id
    String jit;

    @Column(name = "expire_time")
    LocalDateTime expireTime;
}
