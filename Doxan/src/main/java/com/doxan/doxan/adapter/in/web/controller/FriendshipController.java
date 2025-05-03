package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.domain.dto.request.PageRequest;
import com.doxan.doxan.domain.dto.request.friendship.FriendshipRequest;
import com.doxan.doxan.domain.dto.request.friendship.FriendshipUpdateRequest;
import com.doxan.doxan.domain.dto.request.friendship.PageCommonFriendshipRequest;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.friendship.FriendshipResponse;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.port.in.FriendshipUseCase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendships")
public class FriendshipController {
    private final FriendshipUseCase friendshipUseCase;

    public FriendshipController(final FriendshipUseCase friendshipUseCase) {
        this.friendshipUseCase = friendshipUseCase;
    }

    @GetMapping("/{userId}")
    ApiResponse<List<UserResponse>> getFriends(@PathVariable String userId) {
        return ApiResponse.<List<UserResponse>>builder()
                .data(friendshipUseCase.getAllFriendsFromUserId(userId))
                .build();
    }

    @GetMapping("/request/{userId}")
    ApiResponse<List<UserResponse>> getRequesters(@PathVariable String userId) {
        return ApiResponse.<List<UserResponse>>builder()
                .data(friendshipUseCase.getRequester(userId))
                .build();
    }

    @GetMapping("/request/{userId}/count")
    ApiResponse<Long> getNumberRequesters(@PathVariable String userId) {
        return ApiResponse.<Long>builder()
                .data(friendshipUseCase.getNumberOfRequesters(userId))
                .build();
    }

    @GetMapping("/requested/{userId}")
    ApiResponse<List<UserResponse>> getRequested(@PathVariable String userId) {
        return ApiResponse.<List<UserResponse>>builder()
                .data(friendshipUseCase.getRequested(userId))
                .build();
    }

    @PostMapping
    ApiResponse<FriendshipResponse> createFriends(@RequestBody FriendshipRequest request) {
        return ApiResponse.<FriendshipResponse>builder()
                .data(friendshipUseCase.create(request))
                .build();
    }

    @GetMapping("/common-friends")
    ApiResponse<List<UserResponse>> getCommonFriends(@RequestBody PageCommonFriendshipRequest request) {
        return ApiResponse.<List<UserResponse>>builder()
                .data(friendshipUseCase.getCommonFriends(request))
                .build();
    }

    @GetMapping("/common-friends/count")
    ApiResponse<Long> getNumberCommonFriends(@RequestBody FriendshipRequest request) {
        return ApiResponse.<Long>builder()
                .data(friendshipUseCase.getNumberOfCommonFriends(request))
                .build();
    }

    @GetMapping("/count/{userId}")
    ApiResponse<Long> getNumberCommonFriends(@PathVariable("userId") String userId) {
        return ApiResponse.<Long>builder()
                .data(friendshipUseCase.getNumberOfFriends(userId))
                .build();
    }

    @DeleteMapping
    ApiResponse<Void> deleteFriends(@RequestBody FriendshipRequest request) {
        friendshipUseCase.delete(request);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping
    ApiResponse<FriendshipResponse> getFriends(@RequestBody FriendshipRequest request) {
        return ApiResponse.<FriendshipResponse>builder()
                .data(friendshipUseCase.getFriendShip(request))
                .build();
    }

    @PutMapping
    ApiResponse<FriendshipResponse> updateFriend(@RequestBody FriendshipUpdateRequest request) {
        return ApiResponse.<FriendshipResponse>builder()
                .data(friendshipUseCase.update(request))
                .build();
    }

    @PostMapping("/page/{userId}")
    ApiResponse<List<UserResponse>> getPageFriends(
            @PathVariable("userId") String userId,
            @RequestBody PageRequest request) {
        return ApiResponse.<List<UserResponse>>builder()
                .data(friendshipUseCase.getPageFriends(userId, request))
                .build();
    }
}
