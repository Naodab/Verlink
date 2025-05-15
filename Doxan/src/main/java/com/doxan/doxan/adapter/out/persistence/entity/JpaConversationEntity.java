package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.ConversationType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "conversations")
@Table(name = "conversations")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaConversationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;

    @Column(name = "created_at")
    @Builder.Default
    LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    ConversationType type;
}
