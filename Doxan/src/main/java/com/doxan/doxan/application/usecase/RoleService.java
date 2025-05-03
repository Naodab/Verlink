package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.Role;
import com.doxan.doxan.domain.port.in.RoleUseCase;
import com.doxan.doxan.domain.port.out.RoleRepositoryPort;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService implements RoleUseCase {
    private final RoleRepositoryPort roleRepository;

    public RoleService(RoleRepositoryPort roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void deleteByName(String name) {
        roleRepository.deleteByName(name);
    }

    @Override
    @Transactional
    public Role getByName(String roleName) {
        return roleRepository.findByRoleName(roleName).orElseThrow(() ->
                new AppException(ErrorCode.ROLE_NOT_EXISTS));
    }

    @Override
    public Role create(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public List<Role> getAll() {
        return roleRepository.findAll();
    }
}
