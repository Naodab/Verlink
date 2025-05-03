package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "sticker_items")
@Table(name = "sticker_items")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaStickerItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pack_id", nullable = false,
            updatable = false, insertable = false)
    JpaStickerPackEntity pack;

    String name;

    @Column(name = "image_url")
    String imageUrl;
    String tags;
}
