package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.request.permission.PermissionRequest;
import com.doxan.doxan.domain.dto.response.permission.PermissionResponse;
import com.doxan.doxan.domain.model.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionDTOMapper {
    PermissionResponse toResponse(Permission permission);
    Permission fromRequest(PermissionRequest request);
}
