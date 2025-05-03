package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.request.role.RoleRequest;
import com.doxan.doxan.domain.dto.response.role.RoleResponse;
import com.doxan.doxan.domain.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleDTOMapper {
    Role fromRequest(RoleRequest request);
    RoleResponse toResponse(Role role);
}
