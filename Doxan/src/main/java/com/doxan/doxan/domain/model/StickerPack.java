package com.doxan.doxan.domain.model;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StickerPack {
    private String id;
    private String name;
    private String thumbnailUrl;
}
