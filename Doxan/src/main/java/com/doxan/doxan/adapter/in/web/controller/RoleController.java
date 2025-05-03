package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.domain.dto.request.role.RoleRequest;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.role.RoleResponse;
import com.doxan.doxan.domain.dto.mapper.RoleDTOMapper;
import com.doxan.doxan.domain.port.in.RoleUseCase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {
    private final RoleUseCase roleUseCase;
    private final RoleDTOMapper roleMapper;

    public RoleController(final RoleUseCase roleUseCae,
                          final RoleDTOMapper roleMapper) {
        this.roleUseCase = roleUseCae;
        this.roleMapper = roleMapper;
    }

    @GetMapping
    public ApiResponse<List<RoleResponse>> getAll() {
        return ApiResponse.<List<RoleResponse>>builder()
                .data(roleUseCase.getAll().stream()
                        .map(roleMapper::toResponse).toList())
                .build();
    }

    @PostMapping
    public ApiResponse<RoleResponse> create(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .data(roleMapper.toResponse(roleUseCase
                        .create(roleMapper.fromRequest(request))))
                .build();
    }

    @GetMapping("/{name}")
    public ApiResponse<RoleResponse> get(@PathVariable String name) {
        return ApiResponse.<RoleResponse>builder()
                .data(roleMapper.toResponse(roleUseCase.getByName(name)))
                .build();
    }

    @DeleteMapping("/{name}")
    public ApiResponse<Void> delete(@PathVariable String name) {
        roleUseCase.deleteByName(name);
        return ApiResponse.<Void>builder().build();
    }
}
