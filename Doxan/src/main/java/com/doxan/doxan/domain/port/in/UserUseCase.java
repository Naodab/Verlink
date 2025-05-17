package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.user.UserCreateRequest;
import com.doxan.doxan.domain.dto.request.user.UserUpdateRequest;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.model.enums.ActivityState;

import java.util.List;

public interface UserUseCase {
    UserResponse createUser(UserCreateRequest request);
    UserResponse getById(String id);
    UserResponse getMyInfo();
    List<UserResponse> getAll();
    UserResponse update(String id, UserUpdateRequest request);
    UserResponse changeActivityState(String userId, ActivityState state);
    UserResponse changeActivityState(ActivityState state);
    void deleteById(String id);
}
