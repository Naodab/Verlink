package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.ReactionType;
import com.doxan.doxan.domain.model.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "posts")
@Table(name = "posts")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaPostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    JpaUserEntity user;

    @Column(name = "target_id")
    String targetId;

    String content;

    @Enumerated(EnumType.STRING)
    Visibility visibility;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "is_edited")
    boolean edited;

    @Column(name = "share_count")
    int shareCount;

    @Builder.Default
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "post_reactions", joinColumns = @JoinColumn(name = "post_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "reaction_type")
    @Column(name = "count")
    Map<ReactionType, Long> reactionCounts = new EnumMap<>(ReactionType.class);

}
