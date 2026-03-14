package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.UserDTOMapper;
import com.doxan.doxan.domain.dto.request.user.UserCreateRequest;
import com.doxan.doxan.domain.dto.request.user.UserUpdateRequest;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.model.enums.ActivityState;
import com.doxan.doxan.domain.port.in.UserUseCase;
import com.doxan.doxan.domain.port.out.LocationRepositoryPort;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import com.doxan.doxan.domain.port.security.PasswordEncoder;
import com.doxan.doxan.domain.predefined.RolePredefined;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class UserService implements UserUseCase {
    private final UserRepositoryPort userRepository;
    private final LocationRepositoryPort locationRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDTOMapper userDTOMapper;

    public UserService(final UserRepositoryPort userRepository,
                       final LocationRepositoryPort locationRepository,
                       final PasswordEncoder passwordEncoder,
                       UserDTOMapper userDTOMapper) {
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDTOMapper = userDTOMapper;
    }

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())
                || userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userDTOMapper.fromRequest(request);
        if (user.getLocation() != null)
            locationRepository.save(user.getLocation());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setRoles(Set.of(RolePredefined.USER));
        user.setActivityState(ActivityState.OFFLINE);
        return userDTOMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(userDTOMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public UserResponse getById(String id) {
        return userDTOMapper.toResponse(userRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    @Override
    @Transactional
    public UserResponse getMyInfo() {
        return getById(SecurityContextHolder.getContext()
                .getAuthentication().getName());
    }

    @Override
    @Transactional
    public UserResponse update(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTED));
        if (request.getEmail() != null && !user.getEmail().equals(request.getEmail())
                && !userRepository.existsByEmail(request.getEmail())) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !user.getPhone().equals(request.getPhone())
                && !userRepository.existsByPhone(request.getPhone())) {
            user.setPhone(request.getPhone());
        }
        if (request.getUsername() != null && !user.getUsername().equals(request.getUsername())) {
            user.setUsername(request.getUsername());
        }
        if (request.getFirstName() != null && !user.getFirstName().equals(request.getFirstName())) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !user.getLastName().equals(request.getLastName())) {
            user.setLastName(request.getLastName());
        }
        if (request.getDob()  != null && !user.getDob().equals(request.getDob())) {
            user.setDob(request.getDob());
        }
        if (request.getGender() != null && !user.getGender().equals(request.getGender())) {
            user.setGender(request.getGender());
        }
        return userDTOMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse changeActivityState(String userId, ActivityState state) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setActivityState(state);
        return userDTOMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse changeActivityState(ActivityState state) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return changeActivityState(userId, state);
    }

    @Override
    public void deleteById(String id) {
        userRepository.deleteById(id);
    }
}
