package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.user.UserCreateRequest;
import com.doxan.doxan.domain.dto.request.user.UserUpdateRequest;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.model.User;

import java.util.List;

public interface UserUseCase {
    UserResponse createUser(UserCreateRequest request);
    UserResponse getById(String id);
    UserResponse getMyInfo();
    List<UserResponse> getAll();
    UserResponse update(String id, UserUpdateRequest request);
    void deleteById(String id);
}
