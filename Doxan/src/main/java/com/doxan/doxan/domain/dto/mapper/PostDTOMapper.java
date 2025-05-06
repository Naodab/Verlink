package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.request.post.PostCreateRequest;
import com.doxan.doxan.domain.dto.response.post.PostResponse;
import com.doxan.doxan.domain.model.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MediaDTOMapper.class)
public interface PostDTOMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "reactionCounts", ignore = true)
    @Mapping(target = "edited", ignore = true)
    @Mapping(target = "shareCount", ignore = true)
    Post fromCreateRequest(PostCreateRequest request);

    @Mapping(target = "images", ignore = true)
    @Mapping(target = "videos", ignore = true)
    PostResponse fromPost(Post post);
}
