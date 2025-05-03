package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "sticker_packs")
@Table(name = "sticker_packs")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaStickerPackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String thumbnailUrl;
}
