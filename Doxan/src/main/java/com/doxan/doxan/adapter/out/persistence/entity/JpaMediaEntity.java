package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.MediaTargetType;
import com.doxan.doxan.domain.model.enums.MediaType;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@Entity(name = "medias")
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "medias")
public class JpaMediaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "target_id")
    String targetId;

    String url;

    @Column(name = "file_name")
    String fileName;

    @Column(name = "mime_type")
    String mimeType;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type")
    MediaType mediaType;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type")
    MediaTargetType targetType;
}
