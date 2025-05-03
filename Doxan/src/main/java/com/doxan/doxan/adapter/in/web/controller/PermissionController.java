package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.domain.dto.request.permission.PermissionRequest;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.permission.PermissionResponse;
import com.doxan.doxan.domain.dto.mapper.PermissionDTOMapper;
import com.doxan.doxan.domain.port.in.PermissionUseCase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
public class PermissionController {
    private final PermissionUseCase permissionUseCase;
    private final PermissionDTOMapper permissionMapper;

    public PermissionController(final PermissionUseCase permissionUseCase,
                                final PermissionDTOMapper permissionMapper) {
        this.permissionUseCase = permissionUseCase;
        this.permissionMapper = permissionMapper;
    }

    @PostMapping
    ApiResponse<PermissionResponse> create(@RequestBody PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .data(permissionMapper.toResponse(permissionUseCase
                        .create(permissionMapper.fromRequest(request))))
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> findAll() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .data(permissionUseCase.getAll().stream()
                        .map(permissionMapper::toResponse).toList())
                .build();
    }

    @GetMapping("/{name}")
    ApiResponse<PermissionResponse> findByName(@PathVariable("name") String name) {
        return ApiResponse.<PermissionResponse>builder()
                .data(permissionMapper.toResponse(permissionUseCase.getByName(name)))
                .build();
    }

    @DeleteMapping("/{name}")
    ApiResponse<Void> delete(@PathVariable("name") String name) {
        permissionUseCase.deleteByName(name);
        return ApiResponse.<Void>builder().build();
    }
}
