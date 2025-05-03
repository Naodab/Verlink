package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.request.user.LocationRequest;
import com.doxan.doxan.domain.dto.response.user.LocationResponse;
import com.doxan.doxan.domain.model.Location;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LocationDTOMapper {

    @Mapping(target = "id", ignore = true)
    Location fromRequest(LocationRequest request);
    LocationResponse toResponse(Location location);
}
