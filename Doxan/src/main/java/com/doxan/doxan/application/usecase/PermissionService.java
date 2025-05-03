package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.Permission;
import com.doxan.doxan.domain.port.in.PermissionUseCase;
import com.doxan.doxan.domain.port.out.PermissionRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService implements PermissionUseCase {
    private final PermissionRepositoryPort permissionRepository;

    public PermissionService(PermissionRepositoryPort permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public void deleteByName(String name) {
        permissionRepository.deleteByName(name);
    }

    @Override
    public Permission getByName(String name) {
        return permissionRepository.findByName(name).orElseThrow(()
                -> new AppException(ErrorCode.PERMISSION_NOT_EXISTS));
    }

    @Override
    public Permission create(Permission permission) {
        return permissionRepository.save(permission);
    }

    @Override
    public List<Permission> getAll() {
        return permissionRepository.findAll();
    }
}
