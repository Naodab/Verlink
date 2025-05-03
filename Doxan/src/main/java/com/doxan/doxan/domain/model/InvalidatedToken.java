package com.doxan.doxan.domain.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvalidatedToken {
    private String jit;
    private LocalDateTime expireTime;
}
