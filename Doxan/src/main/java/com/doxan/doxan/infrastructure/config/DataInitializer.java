package com.doxan.doxan.infrastructure.config;

import com.doxan.doxan.adapter.out.persistence.adapter.MediaRepositoryAdapter;
import com.doxan.doxan.adapter.out.persistence.adapter.PermissionRepositoryAdapter;
import com.doxan.doxan.adapter.out.persistence.adapter.RoleRepositoryAdapter;
import com.doxan.doxan.application.usecase.PermissionService;
import com.doxan.doxan.application.usecase.RoleService;
import com.doxan.doxan.application.usecase.UserService;
import com.doxan.doxan.domain.dto.request.user.UserCreateRequest;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.port.out.MediaUploader;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import com.doxan.doxan.domain.port.security.PasswordEncoder;
import com.doxan.doxan.domain.predefined.PermissionPredefined;
import com.doxan.doxan.domain.predefined.RolePredefined;
import com.doxan.doxan.domain.predefined.UserPredefined;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class DataInitializer implements ApplicationRunner {
    private final UserRepositoryPort userRepository;
    private final MediaUploader mediaUploader;
    private final PasswordEncoder passwordEncoder;
    private final MediaRepositoryAdapter mediaRepositoryAdapter;
    private final PermissionRepositoryAdapter permissionRepositoryAdapter;
    private final RoleRepositoryAdapter roleRepositoryAdapter;

    public DataInitializer(final UserRepositoryPort userRepository,
                           final MediaUploader mediaUploader,
                           final PasswordEncoder passwordEncoder,
                           final MediaRepositoryAdapter mediaRepositoryAdapter,
                           final PermissionRepositoryAdapter permissionRepositoryAdapter,
                           final RoleRepositoryAdapter roleRepositoryAdapter) {
        this.userRepository = userRepository;
        this.mediaUploader = mediaUploader;
        this.passwordEncoder = passwordEncoder;
        this.mediaRepositoryAdapter = mediaRepositoryAdapter;
        this.roleRepositoryAdapter = roleRepositoryAdapter;
        this.permissionRepositoryAdapter = permissionRepositoryAdapter;
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        PermissionPredefined.getAdminPermissions().forEach(permission -> {
            if (!permissionRepositoryAdapter.existsByName(permission.getName())) {
                permissionRepositoryAdapter.save(permission);
            }
        });

        PermissionPredefined.getUserPermissions().forEach(permission -> {
            if (!permissionRepositoryAdapter.existsByName(permission.getName())) {
                permissionRepositoryAdapter.save(permission);
            }
        });

        RolePredefined.getAllRolesPredefined().forEach(role -> {
            if (!roleRepositoryAdapter.existsByName(role.getName())) {
                roleRepositoryAdapter.save(role);
            }
        });

        if (!userRepository.existsByEmail(UserPredefined.ADMIN.getEmail())) {
            var avatarFile = new ClassPathResource("static/images/default_avatar.jpg")
                    .getInputStream().readAllBytes();
            var coverFile = new ClassPathResource("static/images/default_cover.jpg")
                    .getInputStream().readAllBytes();

            Media avatar = mediaUploader.uploadFromInputStream(
                    avatarFile,
                    "default-avatar.jpg",
                    "image/jpg"
            );

            Media cover = mediaUploader.uploadFromInputStream(
                    coverFile,
                    "default-cover.jpg",
                    "image/jpg"
            );

            mediaRepositoryAdapter.save(avatar);
            mediaRepositoryAdapter.save(cover);

            User admin = UserPredefined.ADMIN;
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
            admin.setProfileImage(avatar);
            admin.setCoverImage(cover);
            userRepository.save(admin);
        }
    }
}
