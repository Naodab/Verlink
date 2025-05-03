package com.doxan.doxan.domain.model;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StickerItem {
    private String id;
    private StickerPack pack;
    private String name;
    private String imageUrl;
    private String tags;
}
